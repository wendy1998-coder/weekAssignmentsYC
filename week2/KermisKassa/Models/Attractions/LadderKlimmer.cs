using System;

namespace KermisKassa.Models.Attractions
{
    public class LadderKlimmer : Attraction, IGambleAttraction
    {
        public LadderKlimmer() : base(5.00, 8, Attractions.LadderKlimmer)
        {
        }

        public void PayGambleGameTax()
        {
            var previousOmzet = Math.Round(Omzet, 2);
            Kassa.Omzet -= previousOmzet;
            Omzet = Math.Round(previousOmzet / 100 * 70, 2);
            Kassa.Omzet += Omzet;
            Console.Out.WriteLine($"Tax payed by LadderKlimmer. Previous income: {previousOmzet}, new income: {Omzet}");
            Kassa.TaxCollected += previousOmzet - Omzet;
        }
    }
}