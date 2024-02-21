const cds = require('@sap/cds');
const odatav2adapterproxy = require('@sap/cds-odata-v2-adapter-proxy');

 cds.on('bootstrap', app => {
//     if (cds.env.requires?.ECEmploymentInformation?.credentials?.authentication === "BasicAuthentication") {
//         const credentials = process.env;
//         cds.env.requires.ECEmploymentInformation.credentials.url = credentials.base_url;
//         cds.env.requires.ECEmploymentInformation.credentials.username = credentials.username;
//         cds.env.requires.ECEmploymentInformation.credentials.password = credentials.password;
//     }

//     if (cds.env.requires?.PLTUserManagement?.credentials?.authentication === "BasicAuthentication") {
//         const credentials = process.env;
//         cds.env.requires.PLTUserManagement.credentials.url = credentials.base_url;
//         cds.env.requires.PLTUserManagement.credentials.username = credentials.username;
//         cds.env.requires.PLTUserManagement.credentials.password = credentials.password;
//     }

//         if (cds.env.requires?.FoundationPlatformPLT?.credentials?.authentication === "BasicAuthentication") {
//             const credentials = process.env;
//             cds.env.requires.FoundationPlatformPLT.credentials.url = credentials.base_url;
//             cds.env.requires.FoundationPlatformPLT.credentials.username = credentials.username;
//             cds.env.requires.FoundationPlatformPLT.credentials.password = credentials.password;
//         }
//         if (cds.env.requires?.ECCompensationInformation?.credentials?.authentication === "BasicAuthentication") {
//             const credentials = process.env;
//             cds.env.requires.ECCompensationInformation.credentials.url = credentials.base_url;
//             cds.env.requires.ECCompensationInformation.credentials.username = credentials.username;
//             cds.env.requires.ECCompensationInformation.credentials.password = credentials.password;
//         }

    app.use(odatav2adapterproxy())
});

module.exports = cds.server;