const FACEBOOK_ACCESS_TOKEN = 'EAAUc2GSU5UIBAOKN6HPb0mAEocqZBS4ZA5c8H6x8d7oRgG7vlZCB62useUoUZAUfWZCllqXNTekvlWiN0YVlqeQ4AnSylpCzLW77WDZA7Ng3v7pOo4Rx1J2fIYD3hqoEzXZBKW1Psd6RKJGhdPN4SzCJYrw336TMzLFdRLtDKAyQdCeHDJasten';
const request = require('request');

const clientes = [
	{
		documento: '03246082928',
		nome: 'Mario Luiz Miranda'
	},
	{
		documento: '05150878901',
		nome: 'Jaime Vieira Junior'
	},
	{
		documento: '02421059984',
		nome: 'Leandro Paulo Romancini'
	}
];

const servicos = [
	{
		id: '8-1234ASDW',
		assetnum: '4130229812',
		tipo: 'LT'
	},
	{
		id: '8-1234QUAS',
		assetnum: 'CTA-4130229812-013',
		tipo: 'BL'
	},
	{
		id: '8-1234IDUA',
		assetnum: 'TV-CTA-4130229812-050',
		tipo: 'TV'
	}
];


var atendimentos = [];

module.exports = (req, res) => {
    if (req.body.object === 'page') {
        req.body.entry.forEach(entry => {

            if (entry.messaging) {
                entry.messaging.forEach(function (event) {

										var senderId = event.sender.id;

                    if (event.message && event.message.text && !event.message.is_echo) {

											if (atendimentos[senderId]) {
													console.log('Atendimento encontrado');

											} else { // INFO - Identifica o cliente e criar o objeto atendimento.
													console.log('Nenhum atendiment encontrado para ', senderId);

													var documento = event.message.text;
													var clienteSelecionado = null;

													if (documento) {
														clientes.forEach(cliente => {
															if (cliente.documento == documento) {
																clienteSelecionado = cliente;
															}
														});
													}

													if (clienteSelecionado) {
															var atendimento = {
																id: senderId,
																cliente: clienteSelecionado,
																step: 'IDENTIFICADO',
																servico: null,
																token: null,
																grupoDiagnostico: null,
																definicaoAtendimento: null
															};

															atendimentos.push(atendimento);

															sendTextMessage(senderId, 'Ah, encontrei seu cadastro ' + clienteSelecionado.nome);
															setTimeout(function() {
																sendMotivosContato(senderId);
															}, 2000);
													}

											}

                    } else {
                        if (event.postback && event.postback.payload) {
                            switch (event.postback.payload) {
                                case 'comecar':
                                    sendTextMessage(senderId, 'Precisamos nos conhecer melhor, informe seu CPF para que lhe encontre na minha base, Vou Verificar se você é você mesmo.');
                                    setTimeout(function() {
                                        sendTextMessage(senderId, ';)');
                                    }, 2000);
                                    break;
																case 'segunda_via_fatura':
																		sendTextMessage(senderId, 'Infelizmente ainda não posso fazer isso.');
																		setTimeout(function() {
                                        sendTextMessage(senderId, ':\'(');
                                    }, 2000);
																		setTimeout(function() {
                                        sendMotivosContato(senderId);
                                    }, 2000);
																		break;
																case 'mudanca_endereço':
																		sendTextMessage(senderId, 'Infelizmente ainda não posso fazer isso.');
																		setTimeout(function() {
                                        sendTextMessage(senderId, ':\'(');
                                    }, 2000);
																		setTimeout(function() {
                                        sendMotivosContato(senderId);
                                    }, 2000);
																		break;
																case 'suporte_tecnico':
																		sendMenuServicos(senderId);
																		break;
																case 'atendimento_bl':
																		// TODO: alterar o step para diagnóstico
																		sendMenuTipificacaoBL(senderId);
																		break;
																case 'internet_nao_navega':
																		// TODO: alterar o step para diagnostico
																		executarDiagnosticoPar1(senderId);
																		break;
																case 'problemas_com_modem':
																		// TODO: alterar o step para diagnostico
																		executarDiagnosticoPar1(senderId);
																		break;
																case 'internet_lenta':
																		// TODO: alterar o step para diagnostico
																		executarDiagnosticoPar1(senderId);
																		break;
																case 'nao_1':
																		finalizarDiagnosticoParte1(senderId);
																		break;
																case 'sim_1':
																		executarDiagnosticoParte2(senderId);
																		break;
																case 'sim_2':
																		executarDiagnosticoParte3(senderId);
																		break;
																case 'nao_2':
																		finalizarDiagnosticoParte2(senderId);
																		break;
																case 'sim_3':
																		executarDiagnosticoParte4(senderId);
																		break;
																case 'nao_3':
																		finalizarDiagnosticoParte3(senderId);
																		break;
																case 'sim_4':
																		finalizarDiagnosticoParte4(senderId);
																		break;
																case 'nao_4':
																		finalizarDiagnosticoParte5(senderId);
																		break;
                                default:
                                    sendTextMessage(senderId, 'Humm???');
																		break;
                            }
                        }
                    }
                });
            }
        });

        res.sendStatus(200);
    }
};

function sendTextMessage(recientId, messageText) {
    var messageData = {
        recipient: { id: recientId },
        message: { text: messageText }
    };

    callSendApi(messageData);
}

function executarDiagnosticoParte4(recientId) {
	var messageData = {
			recipient: { id: recientId },
			message: {
				attachment: {
					type: 'template',
					payload: {
						template_type: 'button',
						text: 'Acabamos de enviar um novo comando de autenticação. Sua internet voltou a funcionar?',
						buttons: [
							{
								type: 'postback',
								title: 'Sim',
								payload: 'sim_4'
							},
							{
								type: 'postback',
								title: 'Não',
								payload: 'nao_4'
							}
						]
					}
				}
			}
	};

	callSendApi(messageData);
}

function executarDiagnosticoParte3(recientId) {
	var messageData = {
			recipient: { id: recientId },
			message: {
				attachment: {
					type: 'template',
					payload: {
						template_type: 'button',
						text: 'Verifique o cambo entre o computador e o modem. Ele está conectado corretamente?',
						buttons: [
							{
								type: 'postback',
								title: 'Sim',
								payload: 'sim_3'
							},
							{
								type: 'postback',
								title: 'Não',
								payload: 'nao_3'
							}
						]
					}
				}
			}
	};

	callSendApi(messageData);
}

function executarDiagnosticoParte2(recientId) {
	var messageData = {
			recipient: { id: recientId },
			message: {
				attachment: {
					type: 'template',
					payload: {
						template_type: 'button',
						text: 'As luzes do modem estão acesas?',
						buttons: [
							{
								type: 'postback',
								title: 'Sim',
								payload: 'sim_2'
							},
							{
								type: 'postback',
								title: 'Não',
								payload: 'nao_2'
							}
						]
					}
				}
			}
	};

	callSendApi(messageData);
}

function executarDiagnosticoPar1(recientId) {
	var messageData = {
			recipient: { id: recientId },
			message: {
				attachment: {
					type: 'template',
					payload: {
						template_type: 'button',
						text: 'Precisamos da sua ajuda para encontrar a melhor solução para o seu problema, para isso é importante que realize os testes a seguir. Vamos começar?',
						buttons: [
							{
								type: 'postback',
								title: 'Sim',
								payload: 'sim_1'
							},
							{
								type: 'postback',
								title: 'Não',
								payload: 'nao_1'
							}
						]
					}
				}
			}
	};

	callSendApi(messageData);
}

function finalizarDiagnosticoParte1(recientId) {
		sendTextMessage(recientId, 'Ok, você pode efetuar os testes remotos quando quiser. Para mais informações, ligue 10315');
		setTimeout(function() {
				sendTextMessage(recientId, '20172601-1234567');
		}, 2000);
}

function finalizarDiagnosticoParte2(recientId) {
		sendTextMessage(recientId, 'Será necessário efetuar a troca do seu modem. Dentro de 24h um técnico estará a caminho da sua residência para efetuar a troca. Acompanhe pelo nosso App');
		setTimeout(function() {
				sendTextMessage(recientId, '20172601-1234567');
		}, 2000);
}

function finalizarDiagnosticoParte3(recientId) {
		sendTextMessage(recientId, 'Ok, você pode efetuar os testes remotos quando quiser. Para mais informações, ligue 10315');
		setTimeout(function() {
				sendTextMessage(recientId, '20172601-1234567');
		}, 2000);
}

function finalizarDiagnosticoParte4(recientId) {
		sendTextMessage(recientId, 'O trabalho em equipe deu resultado! com o reenvio de comandos e sua ajuda, conseguimos solucionar o seu problema de conexão.');
		setTimeout(function() {
				sendTextMessage(recientId, '20172601-1234567');
		}, 2000);
}

function finalizarDiagnosticoParte5(recientId) {
		sendTextMessage(recientId, 'Ok, você pode efetuar os testes remotos quando quiser. Para mais informações, ligue 10315');
		setTimeout(function() {
				sendTextMessage(recientId, '20172601-1234567');
		}, 2000);
}

function sendMenuTipificacaoBL(recientId) {
	var messageData = {
			recipient: { id: recientId },
			message: {
				attachment: {
					type: 'template',
					payload: {
						template_type: 'button',
						text: 'Para qual serviço deseja atendimento?',
						buttons: [
							{
								type: 'postback',
								title: 'Internet não navega',
								payload: 'internet_nao_navega'
							},
							{
								type: 'postback',
								title: 'Problemas com modem',
								payload: 'problemas_com_modem'
							},
							{
								type: 'postback',
								title: 'Internet lenta',
								payload: 'internet_lenta'
							}
						]
					}
				}
			}
	};

	callSendApi(messageData);
}

function sendMenuServicos(recientId) {
	var messageData = {
			recipient: { id: recientId },
			message: {
				attachment: {
					type: 'template',
					payload: {
						template_type: 'button',
						text: 'Para qual serviço deseja atendimento?',
						buttons: [
							{
								type: 'postback',
								title: '4130229812',
								payload: 'atendimento_lt'
							},
							{
								type: 'postback',
								title: 'Internet',
								payload: 'atendimento_bl'
							},
							{
								type: 'postback',
								title: 'TV',
								payload: 'atendimento_tv'
							}
						]
					}
				}
			}
	};

	callSendApi(messageData);
}

function sendMotivosContato(recientId) {
    var messageData = {
        recipient: { id: recientId },
        message: {
					attachment: {
						type: 'template',
						payload: {
							template_type: 'button',
							text: 'Em que posso ser util?',
							buttons: [
								{
									type: 'postback',
									title: 'Segunda via da fatura',
									payload: 'segunda_via_fatura'
								},
								{
									type: 'postback',
									title: 'Suporte técnico',
									payload: 'suporte_tecnico'
								},
								{
									type: 'postback',
									title: 'Mudança de endereço',
									payload: 'mudanca_endereço'
								}
							]
						}
					}
				}
    };

    callSendApi(messageData);
}

function callSendApi(messageData) {
    request(
        {
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: FACEBOOK_ACCESS_TOKEN },
            method: 'POST',
            json: messageData
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('OK!!!');
            } else {
                console.log(error);
            }
        }
    );
}
