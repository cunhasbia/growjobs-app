class Card {
  constructor(id, empresa, cargo, tipoContratacao, local, horarios, descricaoVaga, tecnologias, email, numeroContato) {
    this.id = id;
    this.empresa = empresa;
    this.cargo = cargo;
    this.tipoContratacao = tipoContratacao;
    this.local = local;
    this.horarios = horarios;
    this.descricaoVaga = descricaoVaga;
    this.tecnologias = tecnologias;
    this.email = email;
    this.numeroContato = numeroContato;
  }
}

export default Card;