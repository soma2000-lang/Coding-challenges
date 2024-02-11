const cds = require("@sap/cds");
const log = require("cf-nodejs-logging-support");

log.setLoggingLevel("info");


(async function () {
    sfecei = await cds.connect.to("ECEmploymentInformation");
    sfecus = await cds.connect.to("PLTUserManagement");
    sfecfo = await cds.connect.to("FoundationPlatformPLT");
    sfecci = await cds.connect.to('ECCompensationInformation');
  })();


  const Employeedetails = async (req) => {
    try {
      console.log('running');
      var [usersPhoto,empJob,EmpComp,perPersonal] = await Promise.all([fetchProfilePhoto(req),fetchEmpJob(req),
        fetchcompensation(req),
        fetchPerPersonal(req)]);
      if (Array.isArray(usersPhoto) && usersPhoto.length) {
          usersPhoto.map((image) => {
              image.photo = image.photo ? ("data:image/jpeg;base64," + image.photo.replaceAll("\r\n", "")) : "";
            })
      }
      return  {"perPersonal": perPersonal,   
      "EmpComp": EmpComp,
      "usersPhoto": usersPhoto,
      "empJob" : empJob
    }
    } catch (oErr) {
      req.reject(oErr);
    }
  };

  const fetchPerPersonal = async (req) => {
    try {
      const { userId } = req.data;
      const txecei = sfecus.transaction(req);
      const query = [SELECT.from("perPersonal", (person) => {
        person.defaultFullName,
        person.department,
        person.email,
        person.empId,
        person.gender,
        person.jobCode,
        person.salary,
        person.userId,
        person.manager,
        person.homePhone,
        person.businessPhone,
        person.addressLine1
        
      }).where(`userId IN`,userId)];
      const [perPersonal] = await txecei.send({ method: "GET", query });
      
      if (Array.isArray(perPersonal) && perPersonal.length) {
        return perPersonal[0]
      } else {
        log.info(`Cloudn't find any pending records`);
        return {
          "Name": "",
        };
      }
    }
    catch (oErr) {
      req.reject(oErr);
    }
  };
  
  
  
  
 
  
  const fetchcompensation = async (req) => {
    try {
      const { userId } = req.data;
      const txecti = sfecci.transaction(req);
      const query = [SELECT.from("EmpComp", (person) => {
        person.payGrade, person.payGroup, person.payrollSystemId,person.userId,person.benefitsRate
      }).where(`userId IN`,userId)]
       
  
      const [EmpComp]= await txecti.send({ method: "GET", query });
  
      if (Array.isArray(EmpComp) && EmpComp.length) {
        return EmpComp[0]
      } else {
        log.info(`Cloudn't find any pending records`);
        return {
          "employeecompensation": ""
        };
      }
    }
    catch (oErr) {
      req.reject(oErr);
    }
  };
  
  const fetchEmpJob = async (req) => {
    try {
      const { userId } = req.data;
      const txecfp = sfecei.transaction(req);
      const query = [SELECT.from("empJob", (emp) => {
        emp.userId,
        emp.jobTitle,
        emp.workLocation,
        emp.startDate,
        emp.standardHours,
        emp.location,
        emp.managerId,
        emp.fte,
        emp.endDate,
        emp.division,
        emp.employeeClass
        
        }).where(`userId IN`,userId )];
  
      const [empJob] = await txecfp.send({ method: "GET", query });
  
      if (Array.isArray(empJob) && empJob.length) {
        return empJob[0]
      } else {
        log.info(`Cloudn't find any pending records`);
        return {
          "jobTitle": ""
        };
      }
    }
    catch (oErr) {
      req.reject(oErr);
    }
  };
  
  
  const fetchProfilePhoto = async (req) => {
    try {
      const { userId } = req.data;
      const txecfp = sfecfo.transaction(req);
      const query = SELECT.from("usersPhoto", ["photo", "userId"])
          .where(`userId IN`, userId);
      const [usersPhoto] = await txecfp.send({ method: "READ", query });
      return usersPhoto;
    } catch (oErr) {
      req.error({
        code: 500,
        message: oErr,
        target: oErr,
        status: 500,
      });
    }
  };

 
  module.exports = {
    Employeedetails,fetchProfilePhoto,fetchPerPersonal,fetchEmpJob,fetchcompensation 
  }




















  