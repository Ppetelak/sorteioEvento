var botaoEnviar = document.getElementById('enviarLead');

botaoEnviar.addEventListener('click', function(e) {
    e.preventDefault()
    console.log('Clicou em enviar')
    enviarAPIPainelCorretor();
    enviaDados();

})

function enviarAPIPainelCorretor(){
    var FonteLeadPainelCorretor = "681";
    var nome = $('#nome').val();
    var cidade = $('#cidade').val();
    var telefone = $('#telefone').val();
    var email = $('#email').val();
    var possuiplano = $('input[name=possuiplano]:checked').val()
    var indicacao = new IndicacaoApi('lvJ92P');
    indicacao.Nome = nome;
    indicacao.Email = email;
    indicacao.FonePrincipal = telefone;
    indicacao.FoneCelular = "";
    indicacao.Cidade = cidade;
    indicacao.IdFonte = FonteLeadPainelCorretor;
    indicacao.Modalidade = 'Individual'
    indicacao.Observacao = "Fonte: Sorteio Miniaturas Evento Papo é saúde " + "\n Já possui Plano: " + possuiplano;
    indicacao.enviar();
    console.log(indicacao)
}

function enviaDados(){
    let inlineError = document.getElementById('inline-error');
    let errorDiv = document.getElementById('erro');
    let sucess = document.getElementById('obrigado');
    let formData = {
        nome: $('#nome').val(),
        email: $('#email').val(),
        telefone: $('#telefone').val(),
        cidade: $('#cidade').val(),
        possuiplano: $('input[name=possuiplano]:checked').val()
    }

    console.log(formData)

    if (!formulario.checkValidity()) {
        inlineError.classList.remove('d-none');
        inlineError.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else {
        $.ajax({
            url: '/enviar-lead',
            method: 'POST',
            data: JSON.stringify({ formData: formData}),
            processData: false,
            contentType: 'application/json',
            success: function (data, textStatus, xhr) {
                if (xhr.status === 200) {
                    console.log('Requisição bem-sucedida:', data);
                    inlineError.classList.add('d-none');
                    sucess.classList.remove('d-none');
                    sucess.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    setTimeout(function() {
                        window.location.href = '/roleta?numeroDaSorte=' + data.numeroDaSorte;
                    }, 2000);
                } else {
                    console.log('Requisição concluída, mas com status diferente de 200:', data);
                }
            },
            error: function (xhr, status, error) {
                console.error('Erro ao enviar os dados:', status, error.message);
                errorDiv.classList.remove('d-none');
                inlineError.classList.add('d-none');
                sucess.classList.add('d-none');
                errorDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
                if (xhr.status === 400) {
                    errorDiv.classList.remove('d-none');
                    const errorMessage = xhr.responseJSON.message;
                    const errorMessageElement = document.getElementById('error-message');
                    errorMessageElement.textContent = errorMessage;
                  }
            }
        });
    }
} 