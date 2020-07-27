using System;

namespace KermisKassa.Models
{
    public class MaintenanceException : Exception
    {
        public MaintenanceException(string message) : base(message)
        {

        }
    }
}