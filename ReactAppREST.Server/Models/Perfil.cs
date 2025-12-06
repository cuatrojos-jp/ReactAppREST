using System;
using System.Collections.Generic;

namespace ReactAppREST.Server.Models;

public partial class Perfil
{
    public int PerfilId { get; set; }

    public string? PerfilNombre { get; set; }

    public bool? PerfilActivo { get; set; }

    public virtual ICollection<UsuarioPerfil> UsuarioPerfils { get; set; } = new List<UsuarioPerfil>();
}
