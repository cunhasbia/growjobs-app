import Login from "./login";
import Card from "./cards";
import swal from "sweetalert";

// Array de usuarios
const empresas = [
  {
    name: "Garupa",
    phone: "(51) 9 9999-9999",
    email: "selecao@garupa.com.br",
    login: "garupa",
    password: "123456",
  },
  {
    name: "3035 Tech",
    phone: "(51) 9 9999-9999",
    email: "selecao@3035tech.com",
    login: "3035tech",
    password: "123456",
  },
  {
    name: "Growdev",
    phone: "(51) 9 9999-9999",
    email: "selecao@growdev.com.br",
    login: "growdev",
    password: "123456",
  },
  {
    name: "RCX Tecnologia de Negócios",
    phone: "(53) 9 8333-3333",
    email: "selecao@rcxtech.com.br",
    login: "rcx",
    password: "123456",
  },
];

const growdevers = [
  { login: "William", password: "123456" },
  { login: "Bianca", password: "123456" },
];

let vagas = JSON.parse(localStorage.getItem("vagas")) || [];
let showVagas = JSON.parse(localStorage.getItem("showVagas")) || [];
let id = JSON.parse(localStorage.getItem("id")) || 0;

// Aplicação Growjobs
class App {
  constructor() {
    this.selectLogin = document.getElementById("selectLogin");
    this.nameLogin = document.getElementById("nameLogin");
    this.password = document.getElementById("password");

    this.buttonLogar = document.getElementById("buttonLogar");
    this.buttonAnunciarVaga = document.getElementById("btnAnunciarVaga");
    this.buttonExitEmpresa = document.getElementById("buttonExitEmpresa");
    this.buttonExitGrowdever = document.getElementById("buttonExitGrowdever");
    this.buttonShowMural = document.getElementById("buttonShowMural");
    this.buttonVoltarFormulario = document.getElementById("voltarFormulario");
    this.buttonPesquisar = document.getElementById("buttonPesquisar");

    this.screenLogin = document.getElementById("screenLogin");
    this.screenEmpresa = document.getElementById("screenEmpresa");
    this.screenGrowdever = document.getElementById("screenGrowdever");

    this.logged = JSON.parse(localStorage.getItem("logged")) || [];
    this.actions();
    this.initialization();
  }

  pesquisarVaga() {
    let empresas = document.getElementById("inputGroupEmpresas");
    let tecnologias = document.getElementById("inputGroupTecnologias");

    let temp = [];

    if (empresas.value == "Todas empresas" && tecnologias.value == "Todas") {
      this.growdeverLogged();
    } else {
      const pesquisarVagas = vagas.filter((item) => {
        //filtra por empresa E TODAS TECNOLOGIAS

        if (item.empresa == empresas.value && tecnologias.value == "Todas") {
          temp.push(item);
          //filtra por empresa E TECNOLOGIA ESPECÍFICA
        } else if (item.empresa == empresas.value) {
          console.log("entrou");
          for (let index = 0; index < item.tecnologias.length; index++) {
            if (item.tecnologias[index] == tecnologias.value) {
              temp.push(item);
            }
          }
        } else if (
          empresas.value == "Todas empresas" &&
          tecnologias.value != "Todas"
        ) {
          for (let index = 0; index < item.tecnologias.length; index++) {
            if (item.tecnologias[index] == tecnologias.value) {
              temp.push(item);
            }
          }
        }

        //AQUI MONTA AS VAGAS PELO FILTRO
        document.getElementById("vagas-disponiveis").innerHTML = "";

        if (!temp.length) {
          document.getElementById("total-vagas").innerHTML = `<p>Total de vagas disponíveis: <strong>${temp.length}</strong></p>`;
          document.getElementById("vagas-disponiveis").innerHTML = `<i class="fas fa-exclamation-circle"></i> Infelizmente não encontramos essa vaga em nosso banco de dados.`;
        } else {
          document.getElementById("total-vagas").innerHTML = `<p>Total de vagas disponíveis: <strong>${temp.length}</strong></p>`;
          for (let index = 0; index < temp.length; index++) {
            document.getElementById("vagas-disponiveis").innerHTML += `<div class="card col-12 bg-light mt-2 px-0" data-id="${temp[index].id}">
                                                                        <div class="card-header">${temp[index].empresa.toUpperCase()}
                                                                        </div>
                                                                        <div class="card-body">
                                                                          <h5 class="card-title">${temp[index].cargo}</h5>
                                                                          <p class="card-text my-1"><strong>Tipo de contratação: </strong>${temp[index].tipoContratacao}</p>
                                                                          <div class="row">
                                                                            <div class="col-6"><strong>Local: </strong>${temp[index].local}
                                                                            </div>
                                                                            <div class="col-6"><strong>Horários: </strong>${temp[index].horarios}
                                                                            </div>
                                                                          </div>
                                                                          <p class="card-text my-1"><strong>Descrição da vaga: </strong>${temp[index].descricaoVaga}</p>
                                                                          <p class="card-text"><strong>Tecnologias: </strong>${temp[index].tecnologias}</p>
                                                                          </div>
                                                                          <div class="card-footer bg-light mx-0">
                                                                            <p class="my-1">Para candidatura, enviar currículo para: <b>${temp[index].email}</b></p>
                                                                            <p class="small m-0">Contato: ${temp[index].numeroContato}</p>
                                                                          </div>
                                                                        </div><hr>`;
          }
          document.getElementById("vagas-disponiveis").scrollTo(0, 0);
        }
      });
    }
    temp = [];
  }

  //-> AÇÃO NOS BOTÕES
  actions() {
    this.buttonLogar.onclick = (event) => this.validate(event);
    this.buttonExitEmpresa.onclick = (event) => this.exit(event);
    this.buttonExitGrowdever.onclick = (event) => this.exit(event);
    this.buttonAnunciarVaga.onclick = (event) => this.validarInputsForm(event);
    this.buttonShowMural.onclick = (event) => this.showMural(event);
    this.buttonVoltarFormulario.onclick = (event) => this.voltarFormulario(event);
    this.buttonPesquisar.onclick = (event) => this.pesquisarVaga(event);
  }

  excluirVaga(event) {
    const remove = event.path[1].dataset.id;
    const updateVagas = vagas.filter((item) => item.id != remove);

    localStorage.removeItem("vagas");
    localStorage.setItem("vagas", JSON.stringify(updateVagas));
    vagas = JSON.parse(localStorage.getItem("vagas"));

    swal("Exclusão efetuada com sucesso!", "", "success");

    document.getElementById("vagas-empresa").innerHTML = "";

    this.showMural();
  }

  voltarFormulario() {
    localStorage.removeItem("showVagas");
    document.getElementById("vagas-empresa").innerHTML = "";
    document.getElementById("anunciarVaga").style.display = "block";
    document.getElementById("show-vagas").style.display = "none";
    //ATIVA O BOTAO MURAL DE VAGAS E DESATIVA O NOVA VAGA//
    const linkOff = document.querySelector("#buttonShowMural");
    linkOff.removeAttribute("style");
    linkOff.classList.replace("text-secondary", "text-dark");

    const linkOn = document.querySelector("#voltarFormulario");
    linkOn.setAttribute("style", "pointer-events:none");
    linkOn.classList.replace("text-dark", "text-secondary");

    const tecnologiasVaga = document.getElementsByName("tecnologiasVaga");
    for (let index = 0; index < tecnologiasVaga.length; index++) {
      tecnologiasVaga[index].checked = false;
    }
  }

  showMural() {
    document.getElementById("anunciarVaga").style.display = "none";
    document.getElementById("show-vagas").style.display = "block";

    //DESATIVA O BOTAO MURAL DE VAGAS E ATIVA O NOVA VAGA//
    const linkOff = document.querySelector("#buttonShowMural");
    linkOff.setAttribute("style", "pointer-events:none");
    linkOff.classList.replace("text-dark", "text-secondary");

    const linkOn = document.querySelector("#voltarFormulario");
    linkOn.removeAttribute("style");
    linkOn.classList.replace("text-secondary", "text-dark");

    //
    const infoLogged = JSON.parse(localStorage.getItem("infoLogged"));

    showVagas = vagas.filter((item) => {
      if (item.empresa == infoLogged.name) {
        return item;
      }
    });
    localStorage.setItem("showVagas", JSON.stringify(showVagas));

    if (!showVagas.length) {
      document.getElementById("vagas-empresa").innerHTML = `<i class="fas fa-exclamation-circle"></i> Poxa! Parece que você ainda não divulgou nenhuma vaga.`;
      return;
    }
    document.getElementById("vagas-empresa").innerHTML = "";
    for (let index = 0; index < showVagas.length; index++) {
      document.getElementById("vagas-empresa").innerHTML += `<div class="card col-12 bg-light mt-2 px-0" data-id="${showVagas[index].id}">
                                                              <div class="card-header d-flex justify-content-between align-items-center">${showVagas[index].empresa.toUpperCase()}
                                                                <button class="btn btn-excluir" data-id="${showVagas[index].id}"type="button">
                                                                  <i class="fas fa-trash"></i>
                                                                </button>
                                                              </div>
                                                              <div class="card-body">
                                                                <h5 class="card-title">${showVagas[index].cargo}</h5>
                                                                <p class="card-text my-1"><strong>Tipo de contratação: </strong>${showVagas[index].tipoContratacao}</p>
                                                                <div class="row">
                                                                  <div class="col-6"><strong>Local: </strong>${showVagas[index].local}</div>
                                                                  <div class="col-6"><strong>Horários: </strong>${showVagas[index].horarios}</div>
                                                                </div>
                                                                <p class="card-text my-1"><strong>Descrição da vaga: </strong>${showVagas[index].descricaoVaga}</p>
                                                                <p class="card-text"><strong>Tecnologias: </strong>${showVagas[index].tecnologias}</p>
                                                              </div>
                                                              <div class="card-footer bg-light mx-0">
                                                                <p class="my-1">Para candidatura, enviar currículo para: <b>${showVagas[index].email}</b></p>
                                                                <p class="small m-0">Contato: ${showVagas[index].numeroContato}</p>
                                                              </div>
                                                            </div><hr>`;
    }

    document.querySelectorAll(".btn-excluir").forEach((item) => {
      item.onclick = (event) => this.excluirVaga(event);
    });
  }

  //-> INICIALIZA SEMPRE QUE DA RELOAD, E MOSTRA CONFORME O USUARIO LOGADO OU ENTAO A TELA DE LOGIN
  initialization() {
    this.screenLogin.style.display = "none";

    switch (this.logged[1]) {
      case "1":
        this.screenLogin.style.display = "none";
        this.screenEmpresa.style.display = "block";
        this.screenGrowdever.style.display = "none";
        const infoLogged = JSON.parse(localStorage.getItem("infoLogged"));
        document.getElementById("emailVaga").value = infoLogged.email;
        document.getElementById("phoneVaga").value = infoLogged.phone;

        if (showVagas.length > 0) {
          this.showMural();
        }
        break;
      case "2":
        this.screenLogin.style.display = "none";
        this.screenEmpresa.style.display = "none";
        this.screenGrowdever.style.display = "block";
        this.growdeverLogged();
        break;
      default:
        this.screenLogin.style.display = "block";
        this.screenEmpresa.style.display = "none";
        this.screenGrowdever.style.display = "none";
        break;
    }
  }

  logar() {
    const login = new Login(
      this.selectLogin.value,
      this.nameLogin.value,
      this.password.value
    );

    return login;
  }

  //-> VALIDA SE AS INFORMAÇÕES DE LOGIN ESTAO CERTAS E PREENCHIDAS
  validate() {
    //-> SE O USUARIO SELECIONOU  "EMPRESA OU GROWDEVER"
    if (this.selectLogin.value != "Escolha...") {
      const login = this.logar();

      //-> SE FOR EMPRESA VERIFICA SE O NOME SE SENHA ESTAO CORRETOS
      if (this.selectLogin.value == "1") {
        this.logged = empresas.find((item) => {
          return (
            //-> FORÇO O UPPERCASE, PARA EVITAR PROBLEMAS NA DIGITAÇÃO ENTRE MAISCULA OU MINUSCULA
            item.login.toUpperCase() === nameLogin.value.toUpperCase() &&
            item.password.toUpperCase() === password.value.toUpperCase()
          );
        });

        if (this.logged) {
          swal(`Olá, ${this.nameLogin.value.toUpperCase()}!`, "Bem-vindo(a) a plataforma Growjobs.");
          this.screenLogin.style.display = "none";
          this.screenEmpresa.style.display = "block";
          this.saveLogged(this.nameLogin.value, this.selectLogin.value);
          this.clearInput();
          this.empresaLogged();
        } else {
          swal("Por favor, verifique os dados novamente.");
        }
        //-> SE FOR GROWDEVER VERIFICA SE O NOME E SENHA ESTAO CORRETOS
      } else {
        this.logged = growdevers.find(function (item) {
          return (
            item.login.toUpperCase() === nameLogin.value.toUpperCase() &&
            item.password.toUpperCase() === password.value.toUpperCase()
          );
        });

        if (this.logged) {
          swal(`Olá, ${this.nameLogin.value.toUpperCase()}!`, "Bem-vindo(a) a plataforma Growjobs.");

          this.screenLogin.style.display = "none";
          this.screenGrowdever.style.display = "block";

          this.saveLogged(this.logged.name);
          this.clearInput();
          this.growdeverLogged();
        } else {
          swal("Por favor, verifique os dados novamente.");
        }
      }
    } else {
      swal("Atenção!\nSelecione uma categoria.");
    }
  }

  //SALVA AS INFORMAÇÕES QUE ESTAO NO ARRAY DA EMPRESA, PARA APROVEITAR NO FORMULARIO
  empresaLogged() {
    const find = empresas.find((item) => {
      return item.name.toUpperCase() == this.logged.name.toUpperCase();
    });

    if (find) {
      localStorage.setItem(
        "infoLogged",
        JSON.stringify({
          name: find.name,
          phone: find.phone,
          email: find.email,
        })
      );
    }
    const infoLogged = JSON.parse(localStorage.getItem("infoLogged"));

    document.getElementById("emailVaga").value = infoLogged.email;
    document.getElementById("phoneVaga").value = infoLogged.phone;
  }

  ///APENAS UM TESTE DE CARREGAMENTO DOS DADOS NA TELA GROWDEVER
  growdeverLogged() {
    if (!vagas.length) {
      document.getElementById("vagas-disponiveis").innerHTML = `<i class="fas fa-exclamation-circle"></i> Poxa! No momento, não há nenhuma vaga disponível.`;
    }
    
    document.getElementById("total-vagas").innerHTML = `<p>Total de vagas disponíveis: <strong>${vagas.length}</strong></p>`;
    
    for (let index = 0; index < vagas.length; index++) {
      document.getElementById("vagas-disponiveis").innerHTML += `<div class="card col-12 bg-light mt-2 px-0" data-id="${vagas[index].id}">
                                                                  <div class="card-header">${vagas[index].empresa.toUpperCase()}</div>
                                                                  <div class="card-body">
                                                                    <h5 class="card-title">${vagas[index].cargo}</h5>
                                                                    <p class="card-text my-1"><strong>Tipo de contratação: </strong>${vagas[index].tipoContratacao}</p>
                                                                    <div class="row">
                                                                      <div class="col-6"><strong>Local: </strong>${vagas[index].local}</div>
                                                                      <div class="col-6"><strong>Horários: </strong>${vagas[index].horarios}</div>
                                                                    </div>
                                                                    <p class="card-text my-1"><strong>Descrição da vaga: </strong>${vagas[index].descricaoVaga}</p>
                                                                    <p class="card-text"><strong>Tecnologias: </strong>${vagas[index].tecnologias}</p>
                                                                  </div>
                                                                  <div class="card-footer bg-light mx-0">
                                                                    <p class="my-1">Para candidatura, enviar currículo para: <b>${vagas[index].email}</b></p>
                                                                    <p class="small m-0">Contato: ${vagas[index].numeroContato}</p>
                                                                  </div>
                                                                </div><hr>`;

      document.getElementById("vagas-disponiveis").scrollTo(0, 0);
    }
  }

  validarInputsForm() {
    const inputId = document.getElementById("cargoVaga").value;
    const inputContratacao = document.getElementById("contratacaoVaga").value;
    const inputLocal = document.getElementById("localVaga").value;
    const inputHorarios = document.getElementById("horariosVaga").value;
    const inputDescricao = document.getElementById("descricaoVaga").value;

    if (inputId == "" || inputContratacao == "" || inputLocal == "" || inputHorarios == "" || inputDescricao == "") {
      swal("Por favor, preencha todos os campos solicitados.");
      return;
    } else {
      this.createVaga();
    }
  }

  clearInputsForm() {
    document.getElementById("cargoVaga").value = "";
    document.getElementById("contratacaoVaga").value = "";
    document.getElementById("localVaga").value = "";
    document.getElementById("horariosVaga").value = "";
    document.getElementById("descricaoVaga").value = "";
  }

  //SALVA NO ARRAY DE VAGAS AS INFORMAÇÕES DO FORMULÁRIO
  createVaga() {
    const infoLogged = JSON.parse(localStorage.getItem("infoLogged"));
    const tecnologiasVaga = document.getElementsByName("tecnologiasVaga");
    const checked = [];

    for (let index = 0; index < tecnologiasVaga.length; index++) {
      if (tecnologiasVaga[index].checked == true) {
        checked.push(`${tecnologiasVaga[index].value}`);
      }
    }
    id = JSON.parse(localStorage.getItem("id")) || 0;
    id++;
    vagas.push(
      new Card(
        id,
        infoLogged.name,
        document.getElementById("cargoVaga").value,
        document.getElementById("contratacaoVaga").value,
        document.getElementById("localVaga").value,
        document.getElementById("horariosVaga").value,
        document.getElementById("descricaoVaga").value,
        checked,
        infoLogged.email,
        infoLogged.phone
      )
    );

    localStorage.setItem("id", JSON.stringify(id));
    localStorage.setItem("vagas", JSON.stringify(vagas));
    swal("Obrigada por cadastrar uma vaga!", "Em breve você receberá as candidaturas por e-mail.", "success");
    this.showMural();
    this.clearInputsForm();
  }

  //-> AÇÃO DE LIMPAR O USUARIO LOGADO NO LOCALSTORAGE, AO CLICAR NO BOTAO SAIR
  exit() {
    this.voltarFormulario();
    localStorage.removeItem("logged");
    localStorage.removeItem("infoLogged");
    localStorage.removeItem("showVagas");
    this.screenLogin.style.display = "block";
    this.screenEmpresa.style.display = "none";
    this.screenGrowdever.style.display = "none";
    document.getElementById("vagas-disponiveis").innerHTML = "";
    document.getElementById("show-vagas").style.display = "none";
    document.getElementById("vagas-empresa").innerHTML = "";
    document.getElementById("anunciarVaga").style.display = "block";
    showVagas = [];
    const tecnologiasVaga = document.getElementsByName("tecnologiasVaga");

    for (let index = 0; index < tecnologiasVaga.length; index++) {
      tecnologiasVaga[index].checked = false;
    }
  }

  //-> AO LOGAR CORRETAMENTE, GUARDA NO LOCAL STORAGE PARA MANTER A TELA
  saveLogged() {
    localStorage.setItem(
      "logged",
      JSON.stringify([this.logged.login, this.selectLogin.value])
    );
  }

  clearInput() {
    document.getElementById("selectLogin").value = "Escolha...";
    this.nameLogin.value = "";
    this.password.value = "";
  }
}

new App();