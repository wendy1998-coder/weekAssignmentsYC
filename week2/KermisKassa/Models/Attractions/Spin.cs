using System;

namespace KermisKassa.Models.Attractions
{
    public class Spin : RiskyAttraction, IGambleAttraction
    {
        public Spin() : base(2.25, 8, Attractions.Spin)
        {
            TurnLimit = 5;
        }

        public void PayGambleGameTax()
        {
            var previousOmzet = Math.Round(Omzet, 2);
            Kassa.Omzet -= previousOmzet;
            Omzet = Math.Round(previousOmzet / 100 * 70, 2);
            Kassa.Omzet += Omzet;
            Console.Out.WriteLine($"Tax payed by Spin. Previous income: {previousOmzet}, new income: {Omzet}");
            Kassa.TaxCollected += previousOmzet - Omzet;
        }
    }
}