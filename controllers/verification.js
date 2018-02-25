module.exports = (req, res) => {
    const hubChallenge = req.query['hub.challenge'];

    const hubMode = req.query['hub.mode'];
    const verifyTokenMatches = (req.query['hub.verify_token'] === 'Teste_Bot');

    console.log('begin validation');

    if (hubMode && verifyTokenMatches) {
        console.log('200');
        res.status(200).send(hubChallenge);
    } else {
        console.log('403');
        res.status(403).end();
    }
};
