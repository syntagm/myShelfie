
// Initial Parse!
Parse.initialize("HPO14qrXOVv8i6NKQq5UJeGx07IUMDGY0fRhtK4z", "P1JI9V8KsBN88X0uwAfGh5FVngz4VU7Gc3GTWtrX");
var Post = Parse.Object.extend("Post")

// Page Navigation
function showPage(pageId) {
    $(".page").hide();
    $(pageId).show();
    $(pageId).trigger("page-show");
}


$(window).on("hashchange", function(event){
    showPage(location.hash);
});


location.hash = "";
location.hash = "#login";


function checkLogInStatus() {
    if (Parse.User.current()) {
        // Logged In
        $("body").addClass("logged-in");
        $("#current-user").html("Logged-In as:"+Parse.User.current().get("username")); //this was added later
    } else {
        // Logged out
        $("body").removeClass("logged-in");
    }
}

checkLogInStatus();





// Register form
$("#register-form").submit(function(event){
    event.preventDefault();

    var username = $("#register-username").val();
    var password = $("#register-password").val();
    var password2 = $("#register-password-2").val();

    if (password === password2) {
        var user = new Parse.User();
        user.set("username", username);
        user.set("password", password);

        user.signUp(null, {
            success:function(user){
                console.log("Registration Succeeded!");
                checkLogInStatus();
            }, error:function(user, error){
                console.log("Registration error:"+error.message);
            }
        });
    }
});


// Login Form
$("#login-form").submit(function(event){
    event.preventDefault();

    var username = $("#login-username").val();
    var password = $("#login-password").val();

    Parse.User.logIn(username, password, {
        success: function(user){
            console.log("Login succeeded!");
            checkLogInStatus();
        }, error: function(user, error){
            console.log("Login error:"+error.message);
        }
    });
});


// Listen for page-show from logout
$("#logout").on("page-show", function(event){
    console.log("Log Out page-show!");
    // Log Out with Parse
    Parse.User.logOut();
    checkLogInStatus();
});

$("#register").on("page-show", function(event){
    console.log("Showing Register Page!");
});

// Form id
//$("#post-form").submit(function(event){
//  event.preventDefault(); // prevents new page load
  //  var title = $("#post-title").val();
  //  var content = $("#post-content").val();
  //  var user = Parse.User.current();

  //  var newPost = new Post();
  //  newPost.set("title", title);
//    newPost.set("content", content);
//    newPost.set("user", user);

    //Get file
  //  var fileElement = $("#post-file")[0];
  //  var filePath = $("#post-file").val();
  //  var fileName = filePath.split("\\").pop();

  //  if (fileElement.files.length > 0) {
  //    var file = fileElement.files[0];
  //    var newFile = new Parse.File(fileName, file);
  //    newFile.save({
  //      success: function() {

    //    }, error: function(file, error){
    //      console.log("File Save Error");
    //    }
    //  }).then(function(theFile){
    //      newPost.set("file", theFile);
    //      newPost.save({
    //        success: function(){
    //          getPosts();
    //        }, error: function(error){
    //            console.log("Post Save with File Error:" +error.message);
    //        }
    //      });
    //  });
    //} else {
    //  newPost.save({
      //  success: function(){
    //      getPosts();
    //    }, error: function(error){
    //        console.log("Error:" +error.message);
    //    }
    //  });
    //}
  //});

  function getPosts() {
    var query = new Parse.Query(Post);

    query.include("user");


    query.find({
      success: function(results){
        var output = "";
        for (var i in results){
            var title = results[i].get("title");
            var location = results[i].get("location");
            var content = results[i].get("content");
            var user = results[i].get("user");
            // var username = user.get("username"); //this was excluded

            console.log(results[i].get("file"));

            var img = "";
            if (results[i].get("file")) {
                var file = results[i].get("file");
                var url = file.url();
                console.log("url:"+url);
                img = "<img src='"+url+"'>";
            }

            output += "<li>";
            output += "<h5>"+title+"</h5>";
            output += "<h5>"+location+"</h5>";
            // output += "<small>"+username+"</small>"; //this was excluded
            output += "<h6>"+content+"</h6>";
            output += img;
            output += "</li>";
            output += "<hr>";
            //console.log("Title:"+title)
        }
        $("#list-posts").html(output);
      }, error: function(error){
        console.log("Query Error:"+error.message);
      }
    });
  }

  getPosts();
