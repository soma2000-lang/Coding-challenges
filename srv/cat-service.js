const cds = require('@sap/cds');
const {employeereporthandler} = require('./handler');

class EmployeeService extends cds.ApplicationService {

    
    init() {
       this.on(["READ"], "EmpJob", employeereporthandler.getemployee);
    //    this.on(["READ"], "EmpJob", employeereporthandler.getUsers);
    //    this.on(["READ"], "Photo", employeereporthandler.fetchPhoto);
    //    this.on(["READ"], "EmpCompensation", employeereporthandler.fetchSalary);
    //    this.on(["READ"], "User", employeereporthandler.usersReport);
       
        this.on('fetchEmpDetails', employeereporthandler.fetchEmpDetailInfo);
        // this.on('usersPhoto', employeereporthandler.fetchPhoto);
        // this.on('userjobinfo', employeereporthandler.getUsers);
        // this.on('userpersonalinfo', employeereporthandler.usersReport);
        // this.on('compensationinfo', employeereporthandler.fetchSalary);
    
        return super.init();
    }
}

module.exports = {
    EmployeeService
}