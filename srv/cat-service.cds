using {ECEmploymentInformation} from './external/ECEmploymentInformation.csn';
using {FoundationPlatformPLT} from './external/FoundationPlatformPLT.csn';
using {PLTUserManagement} from './external/PLTUserManagement.csn';
using {ECCompensationInformation} from './external/ECCompensationInformation.csn';

service EmployeeService @(requires: ['authenticated-user']) {
  
    entity Photo          as
    projection on FoundationPlatformPLT.Photo {
       userId,
        photo
    };
    type usersPhoto {                                               
        userId : String;
        photo : String;
    };
    entity EmpJob            as
    projection on ECEmploymentInformation.EmpJob {
      key userId,  
      
      department
    };
    type userjobinfo{
    
        userId : String;
        jobTitle  : String;
        workLocation : String;
        startDate : String;
        standardHours : Integer;
        location : String;
        managerId : Integer;
        fte: Integer;
        endDate: String;
        division: String;
        employeeClass: String;
        
    };
    entity User        as
    projection on PLTUserManagement.User { 
    *
    };
    type userpersonalinfo {
    
        defaultFullName: String;
        department: String;
        email: String;
        empId: Integer;
        gender: String;
        jobCode: String;
        salary: String;
        userId: String;
        manager: String;
        homePhone: String;
        businessPhone: String;
        addressLine1: String;
        
    };
    entity EmpCompensation         as
    projection on ECCompensationInformation.EmpCompensation {
      *
    };
    
    type compensationinfo {
        payGrade: String;
        payGroup: String;
        payrollSystemId: String;
        userId: String;
        benefitsRate: String;
    };
   
        function fetchEmpDetails(userId : String) returns array of {
                User:  userpersonalinfo;
                EmpCompensation  : compensationinfo;
                Photo: usersPhoto;
                EmpJob : userjobinfo 
    };  
    }

    
  
