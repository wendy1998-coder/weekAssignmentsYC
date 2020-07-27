using System;

namespace KermisKassa.Models.Attractions
{
    public abstract class RiskyAttraction : Attraction
    {
        public int TurnLimit { get; set; }
        public int TurnCounter { get; set; }
        protected RiskyAttraction(double price, double surface, Attractions type) : base(price, surface, type)
        {
            SetupInspection();
        }

        public void SetupInspection() {
            Console.Out.WriteLine($"Setup inspection for {Type} completed");
        }

        public void Maintenance()
        {
            TurnCounter = 0;
            Console.Out.WriteLine($"Maintenance for {Type} completed");
        }
    }
}