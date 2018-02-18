const API_AI_TOKEN = '<place your api ai token here>';
const FACEBOOK_ACCESS_TOKEN = 'EAACPRQaGJNkBALddEzTF4EQ32o4KyBLaZCXI1OUkBR7mfhDcB8VhLFWxUamnDZChDfXp2qHTQpvxb0NRZBBZBXpj25uCCFU2y2vIVZBPyqke9VKAXsagVvYzl1ySC23U4MvAj1aHIeHZBW4hLcr9AwhFIIZABOfGwvUGhqjBqJRiwZDZD';

const request = require('request');

const apiAiClient = require('apiai')(API_AI_TOKEN);

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
	},
];

const motivos = [
  'Segunda via da fatura',
  'Aquisição de produtos e serviços',
  'Suporte técnico'
];

const tipificacoes = [
	'Internet não navega',
	'Quedas de conexão',
	'Problemas com modem',
	'Internet lenta'
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

var atendimentos = [
	{
		id: 123456, // sender.id
		cliente: {
			documento: 03246082928,
			nome: 'Mario Luiz Miranda'
		},
    step: 'APRESENTACAO', // APRESENTACAO | IDENTIFICADO | MOTIVO | SERVICO | TIPIFICADO | DIAGNOSTICO | PROTOCOLO
    servico: {
  		id: '8-1234ASDW',
  		assetnum: '4130229812',
  		tipo: 'LT'
  	},
    token: 'EAAeO5Yk0XLABABNdiGJz2fh9VbaUy6H1eIS3aZArVizrcFrS',
    grupoDiagnostico: 1,
    resultadoAtendimento: null
	}
];

const sendImage = (senderId, imageUri) => {
    return request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: {
                attachment: {
                    type: 'image',
                    payload: { url: imageUri }
                }
            }
        }
    });
};

const sendTextMessage = (senderId, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: { text },
        }
    });
};

module.exports = (event) => {

    console.log(event);

    const senderId = event.sender.id;
    const message = event.message.text;

    sendTextMessage(senderId, result);
};
