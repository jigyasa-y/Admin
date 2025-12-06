// Authentication check
const token = localStorage.getItem("adminToken");
if (!token) {
    window.location.href = "login.html";
}

// Configure axios to include token in all requests
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Get admin data with safe parsing
let adminData = {};
try {
    const storedData = localStorage.getItem("adminData");
    if (storedData && storedData !== "null" && storedData !== "") {
        adminData = JSON.parse(storedData);
    }
} catch (error) {
    console.error("Error parsing admin data:", error);
    adminData = {};
    // Clear invalid data
    localStorage.removeItem("adminData");
}

 const userUpdate=document.querySelector("#userUpdate");
 const contactUpdate=document.querySelector("#contactUpdate");
const messageDiv=document.querySelector("#message");
const PopUp=document.querySelector(".popUp");
const delPop=document.querySelector("#deletePopup");

const addSkill=document.querySelector("#addMoreSkills");
 const contentPage=document.querySelector(".content-page");
 const details=document.querySelector(".details");
//  const contact=document.querySelector("Contact");
 const updateskill=document.querySelector("#skillUpdate");
 const skills=document.querySelector(".skills");
 const addProject=document.querySelector("#addProject");
 const viewProject=document.querySelector("#viewProject");
const url="https://admin-server-2.onrender.com";
let userId="123456789";

// Update admin details display
if (adminData.username) {
    const adminNameEl = document.querySelector("#admin-name");
    const adminEmailEl = document.querySelector("#admin-email");
    if (adminNameEl) adminNameEl.textContent = adminData.username;
    if (adminEmailEl) adminEmailEl.textContent = adminData.email || "";
}

// Logout function
const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    window.location.href = "login.html";
};

// Handle token expiration
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            logout();
        }
        return Promise.reject(error);
    }
);

window.onload=()=>{
    // Verify token on page load
    axios.get(`${url}/api/auth/verify`)
        .then((response) => {
            if (response.data.success) {
                // Update admin data if needed
                if (response.data.admin) {
                    localStorage.setItem("adminData", JSON.stringify(response.data.admin));
                    const adminNameEl = document.querySelector("#admin-name");
                    const adminEmailEl = document.querySelector("#admin-email");
                    if (adminNameEl) adminNameEl.textContent = response.data.admin.username;
                    if (adminEmailEl) adminEmailEl.textContent = response.data.admin.email || "";
                }
                userUpdate.click();
            }
        })
        .catch((error) => {
            console.error("Token verification failed:", error);
            logout();
        });
}


 contactUpdate.addEventListener("click", ()=>{
    contentPage.innerHTML=`
    <div class="Contact">
    <div class="Address">
    <input type="text" placeholder="Update address"id="Address">
    <button class="update" id="adressUpdate" onclick="updateAddress()">Update</button>
    </div>


<div class="phoneNum">
<input type="text" id="number" placeholder="Update Mobile Number">
<button id="numberUpdate" class="update" onclick="updatePhoneNum()">Update</button>

</div>
<div class="facebook">
    <input type="text" placeholder="Update Facebook Link" id="Fb_link">
    <button  id="updateFacebook" class="update"onclick="updateFacebook()"> Update</button>


</div>
<div class="Github">
    <input type="text" placeholder="Update Github link" id="Git_link">
    <button id="updateGithub" class="update" onclick="updateGithub()">Update</button>

</div>
<div class="Linked">
<input type="text" placeholder="Update Linked Link" id="Linked_link">
<button class="update" id="updateLinkedin" onclick="updateLinked()">Update</button>
</div>

</div>
    `
 });

 userUpdate.addEventListener("click", ()=>{
contentPage.innerHTML=`<div  class="details">
        <div class="new_name">
<input type="text" placeholder="Update name" id="newName">
<button class="update" id="nameUpdate" onclick="updateName()">Update</button>

        </div>
        <div class="bio">
            <textarea id="Bio"></textarea>

            <button class="update" id="bioUpdate" onclick="updateBio()">Update</button>

        </div>
        <div class="profesion">
            <input type="text" id="proff" placeholder="Update Profession">
            <button class="update" id="professionUpdate" onclick="updateProfession()">Update</button>
        </div>


        <div class="resume">
            <input type="text" id="resume" placeholder="Update Resume link">
            <button class="update" id="resumeUpdate" onclick="updateResume()">Update</button>

        </div>
        <div class="profilePic">
            <input type="file" id="profile_pic" placeholder="">
            <button class="update" id="profileUpdate" onclick="imageUpload()">Update</button>

        </div>
        
    </div>
`
 });
 updateskill.addEventListener("click", ()=>{


contentPage.innerHTML=`
<div class="skills">
    <div class="skill-wrapper">

        <div class="skill">
            <input type="text" placeholder="Enter Name Skill"  class="skillName">
            <input type="text" placeholder="Enter URL" class="skillURL">
        </div>


    </div>
  
    <button id="UpdateSkills" onclick="updateSkill()">Add Skill</button>

</div>
`


       
    // const addMoreBtn = document.querySelector("#addMoreSkills");
    const skillWrapper = document.querySelector(".skill-wrapper");

    // addMoreBtn.addEventListener("click", () => {
    //     skillWrapper.innerHTML += `
    //         <div class="skill">
    //             <input type="text" placeholder="Enter Name Skill" class="skillName">
    //             <input type="text" placeholder="Enter URL" class="skillURL">
    //         </div>
    //     `;
    // });


 });



     addProject.addEventListener("click", ()=>{

        contentPage.innerHTML=`
        
        <div class="AddProject">
        <input type="text" placeholder="Enter project Name" id="projectName">
        <input type="text" placeholder="About" id="about">
        <input type="text" placeholder="Tech used Ex:React NodeJs Express" id="technology">
        <input type="text" placeholder="Enter URL" id="projectURL">
        <input type="file" id="addProject">
    <button id="uploadProject" onclick="updateProject()">Upload</button>
    </div>

        `
    });



    viewProject.addEventListener("click", async()=>{


        contentPage.innerHTML="";
        contentPage.innerHTML='<div class="projects"></div>';
        
try{
const response=await axios.get(`${url}/api/project/view`);
console.log(response.data)

response.data.projects.forEach(project => {
     document.querySelector(".projects").innerHTML+=`
        <div class="my_projects">
<label for="" id="deleteButton" onclick="deleteProject('${project._id}')"><i class="fa-solid fa-trash" style="color: #ff0000;"></i></label>

            <div id="imageCountainer">
                <img src="./public/clinicWebsite.png" id="projectImage" alt="">
            </div>

            <div class="about_project">
                <h1>${project.name}</h1>
                <p id="project_details">${project.about}</p>

                <div class="tech-used"></div>
            </div>

            <a href="" id="viewButton">View project</a>
        </div>

        
        `

    
});



}

catch(error){
    console.log("error im message",error.message);
}





   
    });

    const imageUpload=async()=>{

        const file=document.querySelector("#profile_pic").files[0];
        const fileData=new FormData();
        fileData.append("image",file);
        

        
        try{
            
const response=await axios.post(`${url}/api/update/profilePic`,fileData);

console.log(response);

        }

        catch(error){
            console.log("error in image",error.message);
        }

    }
    
 
const deleteProject=async(id)=>{

    try{
const response=await axios.delete(`${url}/api/project/delete/${id}`);
console.log(response.data);
    }
    catch(error){
        console.log("error in message",error.message);
    }

}


const updateName=async()=>{

    try{
const name=document.querySelector("#newName").value;

const response=await axios.post(`${url}/api/update/name`,{
    name,
    userId
});

document.querySelector("#newName").value=null;

showPop(response.data.message);
// console.log(response.data.message,response.data.user.name);




    }
    catch(error){
        console.log("Error in update name:",error.message);
    }
}

const updateBio=async()=>{
    try{
const bio=document.querySelector("#Bio").value;
const response=await axios.post(`${url}/api/update/bio`,{
    bio,
    userId
});
showPop(response.data.message);
// console.log(response.data.message);
    }
    catch(error){
console.log("error in bio",error.message);
    }
}
const updateProfession=async()=>{
    const profession=document.querySelector("#proff").value;
    try{
const response=await axios.post(`${url}/api/update/profession`,{
    profession,
    userId
});
showPop(response.data.message);
console.log(response.data);
    }
    catch(error){
        console.log("error in message",error.messsage);
    }
}

const updateResume=async()=>{
    const resume=document.querySelector("#resume").value;
    try{
const response=await axios.post(`${url}/api/update/resume`,{
    resume,
    userId
});
showPop(response.data.message);
console.log(response.data.message);
    }
    catch(error){
        console.log("error in message",error.message);
    }
}
const updateAddress=async()=>{
    const address=document.querySelector("#Address").value;
    try{
const response=await axios.post(`${url}/api/contact/address`,{
    address,
    userId
});
showPop(response.data.message);
console.log(response.data.message);
    }
    catch(error){
        console.log("error in Address",error.message);
    }
}
const updatePhoneNum=async()=>{
    const mobile=document.querySelector("#number").value;
    try{
const response=await axios.post(`${url}/api/contact/mobile`,{
    mobile,
    userId
});
showPop(response.data.message);
// console.log(response.data.message);
    }
    catch(error){
        console.log("error in number",error.message);
    }
}

const updateFacebook=async()=>{
    const facebook=document.querySelector("#Fb_link").value;
    try{
const response=await axios.post(`${url}/api/contact/fb`,{
    facebook,
    userId
});
showPop(response.data.message);
console.log(response.data.message);
    }
    catch(error){
        console.log("error in facebook",error.message);
    }
}

const updateGithub=async()=>{
    const github=document.querySelector("#Git_link").value;
    try{
const response=await axios.post(`${url}/api/contact/github`,{
    github,
    userId
});
showPop(response.data.message);
console.log(response.data.message);
    }
    catch(error){
        console.log("error in message",error.message);
    }
}
const updateLinked=async()=>{
    const linkedln=document.querySelector("#Linked_link").value;
    try{
const response=await axios.post(`${url}/api/contact/linkedln`,{
    linkedln,
    userId
});
showPop(response.data.message);
console.log(response.data.message);


}
    
    catch(error){
        console.log("error in message",error.message);
    }
}

const updateSkill=async()=>{
    const name=document.querySelector(".skillName").value;
    const URL=document.querySelector(".skillURL").value;
    try{
const response=await axios.post(`${url}/api/skill/skill`,{
    name,
    URL

});
console.log(response.data.message);
    }
    catch(error){
        console.log("error in message",error.message);
    }
}

const updateProject=async()=>{
    const name=document.querySelector("#projectName").value;
    const about=document.querySelector("#about").value;
    const techs=document.querySelector("#technology").value;
    const URL=document.querySelector("#projectURL").value;
   let image="jiggu.png";

try{
const response=await axios.post(`${url}/api/project/add`,{
    name,
    about,
    techs,
    URL,
    image

});
console.log(response.data.message);
}
catch(error){
    console.log("error in message",error.message);
}
}



const showPop=(message)=>{
    console.log(message);

    // Remove hiding class if it exists
    PopUp.classList.remove("hidden", "hiding");
    
    // Force reflow to restart animation
    void PopUp.offsetWidth;
    
    messageDiv.innerHTML=message;

    // Auto-hide after 3 seconds with smooth animation
    setTimeout(()=>{
        PopUp.classList.add("hiding");
        setTimeout(() => {
            PopUp.classList.add("hidden");
            PopUp.classList.remove("hiding");
        }, 300);
    }, 3000);
}


delPop.addEventListener("click",()=>{
    PopUp.classList.add("hiding");
    setTimeout(() => {
        PopUp.classList.add("hidden");
        PopUp.classList.remove("hiding");
    }, 300);
})

// Logout button
const logoutBtn = document.querySelector("#logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to logout?")) {
            logout();
        }
    });
}
