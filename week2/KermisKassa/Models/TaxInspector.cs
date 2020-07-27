using System;
using KermisKassa.Models.Attractions;

namespace KermisKassa.Models
{
    public class TaxInspector
    {
        public void GetTax(Attraction[] attractions)
        {
            foreach (var attraction in attractions)
            {
                if (!(attraction is IGambleAttraction)) continue;
                var attr = (IGambleAttraction) attraction;
                attr.PayGambleGameTax();
            }

            Console.Out.WriteLine($"Tax collection finished. Total tax collected since opening: {Kassa.TaxCollected}");
        }
    }
}