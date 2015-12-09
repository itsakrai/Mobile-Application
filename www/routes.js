var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var AWS = require('aws-sdk');

//Config
AWS.config.update({accessKeyId: 'keep your aws instance accessKeyId here', secretAccessKey: 'keep your aws instance secretAccessKey here'});
AWS.config.update({region: 'us-east-1'});

var cloudwatch = new AWS.CloudWatch();

var params = {
  
  MetricName: 'CPUUtilization', /* required */
  Namespace: 'AWS/EC2', /* required */
  Period: 3600, /* required */
  //StartTime: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789, /* required */
  StartTime: Math.round(+new Date().setHours(new Date().getHours()-4)/1000),
  //EndTime: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789, /* required */
  EndTime: Math.round(+new Date()/1000),
  /*Statistics: [ /* required */
    //'SampleCount | Average | Sum | Minimum | Maximum',
    /* more items */
 // ]*/,
  Statistics: [ /* required */
    'Maximum'
  ],
  Dimensions: [
    {
      Name: 'InstanceId', /* required */
      Value: 'i-c3efab7d' /* required */
    },
    /* more items */
  ],
  //Unit: 'Seconds | Microseconds | Milliseconds | Bytes | Kilobytes | Megabytes | Gigabytes | Terabytes | Bits | Kilobits | Megabits | Gigabits | Terabits | Percent | Count | Bytes/Second | Kilobytes/Second | Megabytes/Second | Gigabytes/Second | Terabytes/Second | Bits/Second | Kilobits/Second | Megabits/Second | Gigabits/Second | Terabits/Second | Count/Second | None'
  //Unit: 'Seconds'
};

var networkInparams = {
  
  MetricName: 'NetworkIn', /* required */
  Namespace: 'AWS/EC2', /* required */
  Period: 3600, /* required */
  //StartTime: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789, /* required */
  StartTime: Math.round(+new Date().setHours(new Date().getHours()-4)/1000),
  //EndTime: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789, /* required */
  EndTime: Math.round(+new Date()/1000),
  /*Statistics: [ /* required */
    //'SampleCount | Average | Sum | Minimum | Maximum',
    /* more items */
 // ]*/,
  Statistics: [ /* required */
    'Maximum'
  ],
  Dimensions: [
    {
      Name: 'InstanceId', /* required */
      Value: 'i-c3efab7d' /* required */
    },
    /* more items */
  ],
  //Unit: 'Seconds | Microseconds | Milliseconds | Bytes | Kilobytes | Megabytes | Gigabytes | Terabytes | Bits | Kilobits | Megabits | Gigabits | Terabits | Percent | Count | Bytes/Second | Kilobytes/Second | Megabytes/Second | Gigabytes/Second | Terabytes/Second | Bits/Second | Kilobits/Second | Megabits/Second | Gigabits/Second | Terabits/Second | Count/Second | None'
  //Unit: 'Seconds'
};

var networkOutparams = {
  
  MetricName: 'NetworkOut', /* required */
  Namespace: 'AWS/EC2', /* required */
  Period: 3600, /* required */
  //StartTime: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789, /* required */
  StartTime: Math.round(+new Date().setHours(new Date().getHours()-4)/1000),
  //EndTime: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789, /* required */
  EndTime: Math.round(+new Date()/1000),
  /*Statistics: [ /* required */
    //'SampleCount | Average | Sum | Minimum | Maximum',
    /* more items */
 // ]*/,
  Statistics: [ /* required */
    'Maximum'
  ],
  Dimensions: [
    {
      Name: 'InstanceId', /* required */
      Value: 'i-c3efab7d' /* required */
    },
    /* more items */
  ],
  //Unit: 'Seconds | Microseconds | Milliseconds | Bytes | Kilobytes | Megabytes | Gigabytes | Terabytes | Bits | Kilobits | Megabits | Gigabits | Terabits | Percent | Count | Bytes/Second | Kilobytes/Second | Megabytes/Second | Gigabytes/Second | Terabytes/Second | Bits/Second | Kilobits/Second | Megabits/Second | Gigabits/Second | Terabits/Second | Count/Second | None'
  //Unit: 'Seconds'
};
 

//mongoose.connect('mongodb://localhost:27017/appdb');
mongoose.connect('mongodb://mongoDBAdmin:admin@ec2-52-91-28-92.compute-1.amazonaws.com:27017/appdb');

//Creating Models
var Users = require('./model/users');
var Projects = require('./model/projects');

//Utility functions for response
function _401(res) {
  res.status(401);
  res.json({
    "status": 401,
    "message": "Invalid Data"
  });
}
 
function _200(res, data) {
  res.status(200);
  res.json({
    "status": 200,
    "message": "Success",
    "data": data
  });
}

//Authentication user credentials
router.post('/api/auth/login', function(req, res) {
  var user = req.body;
  // validate incoming data
  if (!(user && user.username && user.password))  {
    _401(res); // send a 401 Error
    return;
  } 
  // validate user
  Users.find(user, function(err, user){
   
    if(err || user.length<=0) {
      _401(res); // send a 401 Error
    } else {
       _200(res, user);
    }
   
  });
});

//Updating user profile
router.post('/api/auth/editinfo', function(req, res) {
  var user = req.body;
  // validate incoming data
  if (!(user))  {
    _401(res); // send a 401 Error
    return;
  } 

  // Find and update user
  Users.find({ username: user.username }, function(err, muser) {
   if (err) throw err;
   console.log(muser);
   console.log(user);
   // Find and update user
   Users.findOneAndUpdate(muser, user, function(err, user) {
    if(err || user.length<=0) {
       _401(res); // send a 401 Error
     } else {
        _200(res, user);
     }
   });
 });
 
});
 
 //Creating User 
router.post('/api/auth/signup', function(req, res) {
  var user = req.body;
  var users = new Users(user);
  // validate incoming data
  if (!(user)) {
    _401(res); // send a 401 Error
    return;
  }

  Users.find(user,function(err, euser){
    if(err) return;
    console.log(euser);
  })
  
  var dbUser = users.save();
  if (!dbUser) {
    _401(res); // send a 401 Error
    return;
  } else {
    _200(res, dbUser); // send the user object with a 200 response 
  } 
});

//Adding projects 
router.post('/api/projects/add', function(req, res) {
  var project = req.body;
  var projects = new Projects(project);
  // validate incoming data
  if (!(project && project.id && project.name))  {
    _401(res); // send a 401 Error
    return;
  }
  var dbUser = projects.save();
  if (!dbUser) {
    _401(res); // send a 401 Error
    return;
  } else {
    _200(res, dbUser); // send the user object with a 200 response 
  }
});
//Removing projects 
router.post('/api/projects/remove', function(req, res) {
  var project = req.body;
  // validate incoming data
  if (!(project && project.id))  {
    _401(res); // send a 401 Error
    return;
  }
  Projects.findOneAndRemove({id: project.id},function(err) {
    if (err) {
      _401(res); // send a 401 Error
      return;
    } else {
      _200(res,'Project deleted'); // send the user object with a 200 response 
    }
  });
});

//Retreving projects
router.get('/api/projects/all/', function(req, res) {
  Projects.find({},function(err, projects){
    if(err) {
      _401(res); // send a 401 Error
    } else {
      _200(res, projects);
    }   
  }); 
});
 
router.get('/api/alerts/getalerts/:_id', function(req, res) {
  var _id = req.params._id;

  console.log(_id);
 
});

router.get('/api/metrics/cpuutilization', function(req, res) {
  cloudwatch.getMetricStatistics(params, function(err, data) {
  if (err) {
    // an error occurred
    console.log(err, err.stack);
  }  
  else {
    // successful response
    console.log(data); 
     _200(res, data); 
  }             
  });
});

router.get('/api/metrics/networkin', function(req, res) {
  cloudwatch.getMetricStatistics(networkInparams, function(err, data) {
  if (err) {
    // an error occurred
    console.log(err, err.stack);
  }  
  else {
    // successful response
    console.log(data); 
     _200(res, data); 
  }             
  });
});

router.get('/api/metrics/networkout', function(req, res) {
  cloudwatch.getMetricStatistics(networkOutparams, function(err, data) {
  if (err) {
    // an error occurred
    console.log(err, err.stack);
  }  
  else {
    // successful response
    console.log(data); 
     _200(res, data); 
  }             
  });
});

 
module.exports = router;