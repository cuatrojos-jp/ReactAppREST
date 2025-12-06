using System;
using System.Collections.Generic;

namespace ReactAppREST.Server.Models;

public partial class UsuarioPerfil
{
    public int UsuarioPerfilId { get; set; }

    public int UsuarioId { get; set; }

    public int PerfilId { get; set; }

    public virtual Perfil Perfil { get; set; } = null!;

    public virtual Usuario Usuario { get; set; } = null!;
}
