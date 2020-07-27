namespace KermisKassa.Models.Attractions
{
    public class Hawaii : RiskyAttraction
    {
        public Hawaii() : base(2.90, 8, Attractions.Hawaii)
        {
            TurnLimit = 10;
        }
    }
}