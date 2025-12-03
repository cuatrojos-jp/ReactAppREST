using System;
using System.Collections.Generic;

namespace ReactAppREST.Server.Models;

public partial class CaGrado
{
    public int CaGradNId { get; set; }

    public string CaGradTDescripcion { get; set; } = null!;

    public virtual ICollection<CaAlumno> CaAlumnos { get; set; } = new List<CaAlumno>();
}
