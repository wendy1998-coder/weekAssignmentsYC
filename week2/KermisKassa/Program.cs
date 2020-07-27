using System;
using System.Linq;
using KermisKassa.Models;
using KermisKassa.Models.Attractions;

namespace KermisKassa
{
    class Program
    {
        static void Main(string[] args)
        {
            Attraction[] attractions =
            {
                new BotsAuto(),
                new Spin(),
                new Spookhuis(),
                new LadderKlimmer(),
                new Hawaii(),
                new SpiegelPaleis()
            };
            var intro = "Welcome to the Carnival! There are 6 rides and you can call them by their number:";
            foreach (int i in Enum.GetValues(typeof(Attractions)))
            {
                var name = Enum.GetName(typeof(Attractions), i);
                intro += $"\n{i} for {name}";
            }

            intro += "\nTo inspect the number of tickets sold type 'k' " +
                     "and to inspect the amount of money earned, type 'o'.\n";
            intro += "To leave the carnaval, type 'q'";

            Console.Out.WriteLine(intro);
            var taxCounter = 0;

            while (true)
            {
                if (taxCounter == 15)
                {
                    Console.Out.WriteLine("Tax Inspector visit!");
                    var inspector = new TaxInspector();
                    inspector.GetTax(attractions);
                    taxCounter = 0;
                }

                Console.Out.WriteLine("pick a number or letter (use q to quit)");
                var s = Console.ReadLine();
                if (string.IsNullOrEmpty(s))
                {
                    Console.Out.WriteLine("No input provided");
                    continue;
                }

                switch (s.TrimEnd())
                {
                    case "q":
                        return;
                    case "k":
                        var ticketsSold = $"Total tickets sold: {Kassa.TicketsSold}";
                        foreach (var attraction in attractions)
                        {
                            ticketsSold += $"\nTickets sold by {attraction.Type}: {attraction.TicketsSold}";
                        }

                        Console.Out.WriteLine(ticketsSold);
                        break;
                    case "o":
                        var Omzet = $"Total money earned: {Math.Round(Kassa.Omzet, 2)}";
                        foreach (var attraction in attractions)
                        {
                            Omzet += $"\nMoney earned by {attraction.Type}: {Math.Round(attraction.Omzet, 2)}";
                        }

                        Console.Out.WriteLine(Omzet);
                        break;
                    case "1":
                    case "2":
                    case "3":
                    case "4":
                    case "5":
                    case "6":
                        var num = Int32.Parse(s);
                        taxCounter++;
                        foreach (var attraction in attractions)
                        {
                            if ((int) attraction.Type == num)
                            {
                                try
                                {
                                    attraction.Turn();
                                }
                                catch (MaintenanceException e)
                                {
                                    Console.Out.WriteLine(e.Message);
                                    var m = Console.ReadLine();
                                    if (!string.IsNullOrEmpty(s) && m.Equals("m"))
                                    {
                                        ((RiskyAttraction) attraction).Maintenance();
                                    }
                                    else
                                    {
                                        Console.Out.WriteLine("No maintenance was called. Ride still out of order.");
                                    }

                                    taxCounter--;
                                }

                                break;
                            }
                        }

                        break;
                    default:
                        Console.Out.WriteLine("Invalid value given");
                        break;
                }
            }
        }
    }
}