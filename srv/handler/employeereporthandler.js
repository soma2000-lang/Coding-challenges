
    
  const cds = require("@sap/cds");
  const log = require("cf-nodejs-logging-support");
  
  log.setLoggingLevel("info");
  
  
  (async function () {
      sfecei = await cds.connect.to("ECEmploymentInformation");
      sfecus = await cds.connect.to("PLTUserManagement");
      sfecfo = await cds.connect.to("FoundationPlatformPLT");
      sfecci = await cds.connect.to('ECCompensationInformation');
    })();

    const getemployee = async (req) => {
      try {
       // console.log("running");
        const managerId = '108743';
        //console.log(managerId);
        const txecei =  sfecei.transaction(req);
        let usersInfo = await txecei.get(
          `/EmpJob?$format=json&$select=userId,department&$filter=managerId eq '${managerId}'`
        );
      //  console.log(usersInfo);
        return usersInfo;
      } catch (err) {
        req.reject(err);
      }
    }

 
    
    
    const getUsers = async (req) => {
      try {
        const { userId } = req.data;
        console.log(userId);
        const txecfp = sfecei.transaction(req);
        const query = [SELECT.from("EmpJob", (emp) => {
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
          
          }).where({ userId: userId})];
    
        const [EmpJob] = await txecfp.send({ method: "GET", query });
        //console.log("emp",EmpJob);
        if (Array.isArray(EmpJob) && EmpJob.length) {
          console.log(EmpJob[0]);
          return EmpJob[0];
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
    

    
    const usersReport = async (req) => {
      try {
        const { userId } = req.data;
        //console.log(userId);
        const txecei = sfecus.transaction(req);
        const query = [SELECT.from("User", (person) => {
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
          
        }).where({ userId: userId })];
        const [User] = await txecei.send({ method: "GET", query });
        //console.log("user",User);
        if (Array.isArray(User) && User.length) {
          //console.log(User);
          return User[0];
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
    
    
    
    
   
    
    const fetchSalary = async (req) => {
      try {
        const { userId } = req.data;
        console.log(userId);
        const txecti = sfecci.transaction(req);
        const query = SELECT.from("EmpCompensation", (person) => {
          person.payGrade, person.payGroup, person.payrollSystemId,person.userId,person.benefitsRate
        }).where({ userId: userId });
         
        //console.log("query",query);
        const EmpCompensation= await txecti.send({ method: "READ", query });
        console.log("EmpCompensation",EmpCompensation[0]);
        return EmpCompensation[0];
        

      }
      catch (oErr) {
        req.reject(oErr);
      }
    };
    
  
    
    const fetchPhoto = async (req) => {
      try {
       // console.log("running");
        const { userId } = req.data;
        const txecfp = sfecfo.transaction(req);
        const query = [SELECT.from("Photo", ["photo", "userId"])
            .where({ userId: userId ,photoType:1})];
        const [Photo] = await txecfp.send({ method: "READ", query });
        console.log("photo",Photo[0]);
        
        return Photo[0];
      } catch (oErr) {
        req.error({
          code: 500,
          message: oErr,
          target: oErr,
          status: 500,
        });
      }
    };

    
    const fetchEmpDetailInfo = async (req) => {
      try {
        console.log('running');
        var [Photo,EmpJob,EmpCompensation,User]= await Promise.all([fetchPhoto(req),getUsers(req),
          fetchSalary(req),
           usersReport(req)]);
          console.log(Photo);
          console.log(EmpJob);
          console.log(EmpCompensation);
          console.log(User);
          if (Array.isArray(EmpJob) && EmpJob.length) {
            for(const user of EmpJob){
              Photo.map((image) => {
                if(user.userId==image?.userId){
                  user.photo = image.photo ? ("data:image/jpeg;base64," + image.photo.replaceAll("\r\n", "")) : "";
                  user.photo=image.photo;
                }
                })
              }
      }
        
        return {
          "User": User,   
          "EmpCompensation": EmpCompensation,
          "Photo":Photo ,
          "EmpJob" : EmpJob
        }
      } catch (oErr) {
        req.reject(oErr);
      }
    };
  
   
    module.exports = {
     //getUsers,
      getemployee,
      //  usersReport,
      // fetchSalary,
      //  fetchPhoto,

      fetchEmpDetailInfo
    }
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
    


 
  module.exports = {
    getUsers,
    usersReport,
    fetchSalary,
    fetchPhoto ,
    getemployee ,
   fetchEmpDetailInfo
  }




















  