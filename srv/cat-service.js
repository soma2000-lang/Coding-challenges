const cds = require('@sap/cds');
const {employeereporthandler} = require('./handler');

class EmployeeService extends cds.ApplicationService {

    
    init() {
       this.on(["READ"], "User", employeereporthandler.fetchPerPersonal);
       
        // this.on('userpersonalinfo', employeereporthandler.fetchPerPersonal);
        // this.on('usersPhoto', employeereporthandler.fetchProfilePhoto);
        // this.on('usersPhoto', employeereporthandler.Employeedetails);
        // this.on('userjobinfo', employeereporthandler.fetchEmpJob);
        this.on('fetchEmpDetails',employeereporthandler.Employeedetails);
     
     
        return super.init();
    }
}

module.exports = {
    EmployeeService
}