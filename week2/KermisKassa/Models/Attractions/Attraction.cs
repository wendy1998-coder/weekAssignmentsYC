using System;

namespace KermisKassa.Models.Attractions
{
    public abstract class Attraction
    {
        public double Omzet { get; set; }
        public double Price { get; }
        public double Surface { get; set; }
        public int TicketsSold { get; set; }
        public Attractions Type { get; }

        public Attraction(double price, double surface, Attractions type)
        {
            Price = price;
            Surface = surface;
            Type = type;
        }

        public void Turn()
        {
            if (this is RiskyAttraction)
            {
                var risky = (RiskyAttraction) this;
                if (risky.TurnCounter == risky.TurnLimit)
                {
                    throw new MaintenanceException($"Turnlimit of {Type} ({risky.TurnLimit}) reached. " +
                                        "To call a maintenance member, press 'm' now.");
                }

                risky.TurnCounter++;
            }
            Omzet += Price;
            TicketsSold++;
            Kassa.Omzet += Price;
            Kassa.TicketsSold++;
            Console.Out.WriteLine("Attraction " + Type + $" is turning. Money earned: {Price}");
        }

    }
}