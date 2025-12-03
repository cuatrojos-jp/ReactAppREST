using System;
using System.Collections.Generic;

namespace ReactAppREST.Server.Models;

public partial class CaAlumno
{
    public int CaAlumNId { get; set; }

    public int? CaGradNId { get; set; }

    public string? CaAlumTNombre { get; set; }

    public string? CaAlumTApellidoPaterno { get; set; }

    public string? CaAlumTApellidoMaterno { get; set; }

    public string? CaAlumTTelefono { get; set; }

    public bool? BActivo { get; set; }

    public virtual CaGrado? CaGradN { get; set; }
}
