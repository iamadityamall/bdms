window.addEventListener("load", function () {
  fetchWorkIDDetails();
  getFoldersBasedOnName();
});

let TF = [];
let GLMS = [];
let ICONNECT = [];
let CLMS = [];

async function getFoldersBasedOnName() {
  let response = await fetch(
    `http://45.118.162.234:9988/api/getWorkId?userName=aditya`
  );
  let body = await response.json();
  console.log(body);
  body.map((item) => {
    if (item.deptName === "TF") {
      TF.push(item);
    } else if (item.deptName === "GLMS") {
      GLMS.push(item);
    } else if (item.deptName === "I-CONNECT") {
      ICONNECT.push(item);
    } else if (item.deptName === "CLMS") {
      CLMS.push(item);
    }
  });
  localStorage.setItem("tf", JSON.stringify(TF));
  localStorage.setItem("glms", JSON.stringify(GLMS));
  localStorage.setItem("iconnect", JSON.stringify(ICONNECT));
  localStorage.setItem("clms", JSON.stringify(CLMS));
}

async function checkerDetails(dep) {
  if (dep === "tradefinance") {
    dep = "TradeFinance";
  } else if (dep === "clms") {
    dep = "GLMS";
  } else if (dep === "iconnect") {
    dep = "I-CONNECT";
  }
  console.log("department: " + dep);
  try {
    let response = await fetch(
      `http://45.118.162.234:9988/api/getChecker?deptName=${dep}`
    );
    let body = await response.json();
    if (response.status === 200) {
      showCheckerIdList(body);
    }
  } catch (e) {
    console.log(e);
  }
}

let checkerDetailsArray = [];

function showCheckerIdList(body) {
  console.log("in showcheckerIdlist: ======================");
  console.log(body);
  checkerDetailsArray = [...body];
  let assignedTo = document.querySelector(".assignedTo");
  empty(assignedTo);
  let selectOption = document.createElement("option");
  selectOption.innerText = "Select your option";
  assignedTo.append(selectOption);
  body.forEach((option) => {
    let { fullName, emailId } = option;
    let optionEl = document.createElement("option");
    optionEl.innerText = fullName;
    optionEl.style.padding = "0.5rem 0";
    optionEl.value = fullName;
    assignedTo.append(optionEl);
  });
}

document.querySelector(".assignedTo").addEventListener("change", function () {
  checkerDetailsArray.forEach((item) => {
    console.log(item);
    if (this.value === item.fullName) {
      let emailInput = document.getElementById("checkerEmail");
      emailInput.setAttribute("value", item.emailId);
    } else {
      alert("hello");
    }
  });
});

async function fetchWorkIDDetails() {
  let response = await fetch(
    "http://45.118.162.234:9988/api/getWorkId?userName=Abhishek"
  );
  let body = await response.json();
}

let createWorkId = document.getElementById("createWorkId");
let createWorkIdButton = document.getElementById("createWorkIdButton");
let closeWorkIdSectionButton = document.getElementById(
  "closeWorkIdSectionButton"
);
let accordions = document.getElementsByClassName("accordion");
var notyf = new Notyf({
  duration: 6000,
});

for (var i = 0; i < accordions.length; i++) {
  accordions[i].addEventListener("click", function () {
    this.classList.toggle("active");
    /* Toggle between hiding and showing the active panel */
    var panel = this.nextElementSibling;
    if (panel.style.display === "grid") {
      panel.style.display = "none";
    } else {
      panel.style.display = "grid";
    }
  });
}

closeWorkIdSectionButton.addEventListener("click", () => {
  createWorkId.style.display = "none";
});

function closeModal(a) {
  let grandparent = a.parentNode.parentNode;
  grandparent.style.display = "none";
}

createWorkIdButton.addEventListener("click", function () {
  createWorkId.style.display = "grid";
});

async function getResponse(directoryName) {
  const response = await fetch(`http://localhost:9990/api/getAllDirectories`);
  const body = await response.json();
  showData(body);
}

getResponse();

function showData(body) {
  const directories = document.getElementById("directories");
  body.map((item) => {
    let { folderlength, name, isFolderEmpty, absolutePath, items, parent } =
      item;
    // console.log("level 01: " + "filename: " + name);
    // console.log("level 01: " + parent);
    const li = document.createElement("li");
    const details = document.createElement("details");
    details.open = true;
    const summary = document.createElement("summary");
    const ul = document.createElement("ul");

    summary.innerHTML = ` <i class="fa-solid fa-folder"></i><span>${name}</span>`;
    if (items.length) {
      for (let i of items) {
        const subFolder = document.createElement("li");
        subFolder.innerHTML = ` <i class="fa-solid fa-folder"></i><span>${i["name"]}</span>`;
        ul.append(subFolder);
        ul.classList.add("margin-left");
        subFolder.addEventListener("click", function () {
          //showWorkIdDirectories(i);
          showWorkDirectory(this);
        });
      }
    } else {
      alert("empty array");
    }

    details.append(summary);
    details.append(ul);
    li.append(details);
    directories.append(li);
  });
}

function showWorkDirectory(a) {
  let parent = a.parentNode.previousElementSibling;
  let deptname = parent.querySelector("span").innerText;
  if (deptname === "CLMS") {
    insertInTree(CLMS);
  } else if (deptname === "GLMS") {
    insertInTree(GLMS);
  } else if (deptname === "i-Connect") {
    insertInTree(ICONNECT);
  } else if (deptname === "TF") {
    insertInTree(TF);
  } else if (deptname === "HR") {
    insertInTree();
  }
}

function insertInTree(body) {
  let tree = document.getElementById("tree");
  empty(tree);
  if (!body) {
    notyf.error(`It is an empty folder`);
  } else {
    for (let i of body) {
      const li = document.createElement("li");
      let status = i.statusAction;
      li.style.cursor = "pointer";
      li.style.padding = "0.25rem";
      li.style.display = "grid";
      li.style.gridTemplateColumns = "1fr auto";
      li.innerHTML = ` <div> <i style="color: #FFA500; margin-right: 0.25rem" class="fa-solid fa-folder"></i><span>${
        i["workId"]
      }</span> </div><button type="button" style="cursor:pointer;border: none;padding: 0.5rem; ${
        i.statusAction === "Verified"
          ? "background: green; color: white; border-radius: 10px;"
          : "background: #F9E2AF; border-radius: 10px;"
      }" onclick='showModal("${status}", "${i.workId}")'>${
        i.statusAction
      }</button>`;
      tree.append(li);
      li.addEventListener("click", async function () {
        // showIndividualfile(i, parent, name);
        // console.log(i)
        // showFiles(i.deptName, "workId", i.workId);
        let response = await fetch(
          `http://localhost:9990/api/files/${i.deptName}/workId/${i.workId}`
        );
        let body = await response.json();
        console.log();
        showIndividualfile(body, i.deptName);
      });
    }
  }
}

async function showModal(status, workId) {
  let response = await fetch(
    `http://localhost:9990/api/getDetails?workIdString=${workId}`
  );

  let body = await response.json();
  if (response.ok) {
    autopopulatemodal(body, status);
  } else {
    alert("failed to fetch");
  }
}

function autopopulatemodal(data, status) {
  console.log(data);
  let wID = data.workId;
  let fArr = data.fileList;
  let dpt = wID.dept_name;
  console.log(dpt);
  let dptDtls = data.departmentDetails;
  let depHtml = ``;
  let filepath = `http://localhost:9990/api/download/${dpt}/workId/${wID.work_id}/`;
  let checkerWorkId = document.getElementById("checkerWorkId");
  let form = document.getElementById("checkeridform");
  if (dpt === "CLMS" || dpt === "GLMS") {
    depHtml = `
    <button
          type="button"
          class="closeWorkIdSectionButton"
          id="checkercloseWorkIdSectionButton"
          onclick="closeModal(this)"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
        <article class="createWorkIdLeft">
          <div class="inputContainerOne">
            <div class="box boxOne">
              <label for="">Finacle Reference Number</label>
              <input type="text" readonly name="finacleReferenceNumber" />
            </div>
            <div class="box boxTwo">
              <label for="">Registration Number</label>
              <input
                type="text"
                value="${
                  dptDtls.registrationNumber === null
                    ? ""
                    : dptDtls.registrationNumber
                }"
                readonly
                name="registrationNumber"
              />
            </div>
            <div class="box boxtThree">
              <label for="">Unique Reference Number</label>
              <input
                type="text"
                value="${dptDtls.uniqueReferenceNumber}"
                readonly
                name="uniqueReferenceNumber"
              />
            </div>
          </div>

          <div class="inputContainerThree three">
            <button type="button" class="accordion">
              <span>Branch Info</span>
              <i class="fa-sharp fa-solid fa-arrow-down"></i>
            </button>
            <div class="panel">
              <div class="panelBox">
                <label for=""
                  >Branch Sol ID
                  <span style="margin-left: 10px; color: red">*</span></label
                >
                <div class="panelBoxInput">
                  <input
                    type="text"
                    placeholder="Branch Sol ID"
                    name="branchSolID"
                    value="${dptDtls.branchSolID}"
                    readonly
                  />
                </div>
              </div>
              <div class="panelBox">
                <label for=""
                  >TF Location Sol ID
                  <span style="margin-left: 10px; color: red">*</span></label
                >
                <div class="panelBoxInput">
                  <input
                    type="text"
                    placeholder="TF Location Sol ID"
                    name="tfLocationSolID"
                    value="${dptDtls.tfLocationSolID}"
                    readonly
                  />
                </div>
              </div>
              <div class="panelBox">
                <label for=""
                  >CTPC Sol ID
                  <span style="margin-left: 10px; color: red">*</span></label
                >
                <div class="panelBoxInput">
                  <input
                    type="text"
                    placeholder="CTPC Sol ID"
                    name="ctpcSolID"
                    value="${dptDtls.ctpcSolID}"
                    readonly
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="inputContainerTwo">
            <button type="button" class="accordion">
              <span>Product Information</span>
              <i class="fa-sharp fa-solid fa-arrow-down"></i>
            </button>
            <div class="panel">
              <div class="panelBox">
                <label for=""
                  >Product Category :<span style="margin-left: 10px; color: red"
                    >*</span
                  ></label
                >
                <div class="panelBoxInput">
                  <input
                    type="text"
                    placeholder="CTPC Sol ID"
                    name="ctpcSolID"
                    value="${dptDtls.productCategory}"
                    readonly
                  />
                </div>
              </div>
              <div class="panelBox">
                <label for=""
                  >Product Type :<span style="margin-left: 10px; color: red"
                    >*</span
                  ></label
                >
                <div class="panelBoxInput">
                  <input
                    type="text"
                    placeholder="CTPC Sol ID"
                    name="ctpcSolID"
                    value="${dptDtls.productType}"
                    readonly
                  />
                </div>
              </div>
            </div>
          </div>

          <div id="departmentContainer">
                <!-- clms glms -->
            <div id="clms" class="department">
              <div class="inputContainerThree">
                <button type="button" class="accordion">
                  <span>Contact Information</span>
                  <i class="fa-sharp fa-solid fa-arrow-down"></i>
                </button>

                <div class="panel">
                  <div class="panelBox">
                    <label for=""
                      >Customer : <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        id="customer"
                        required
                        name="customerName"
                        value ="${dptDtls.customerName}";
                        readonly
                      />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Beneficiary Title :</label>
                    <div class="panelBoxInput">
                      <input type="text" name="beneficiaryTitle" value ="${
                        dptDtls.beneficiaryTitle
                      }";
                        readonly/>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >Beneficary Name :
                      <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        id="beneficaryname"
                        required
                        name="beneficiaryName1"
                        value ="${dptDtls.beneficiaryName1}";
                        readonly
                      />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >Beneficary Name
                      <span style="font-size: 10px">(local language)</span>
                      :</label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        id="localname"
                        name="beneficiaryName2"
                         value ="${dptDtls.beneficiaryName2}";
                        readonly
                      />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >Address Line 1 : <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        id="address"
                        required
                        name="addressLine1"
                        value ="${dptDtls.addressLine1}";
                        readonly
                      />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >State LGD Code : <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        id="statelgd"
                        required
                        name="stateLGDCode"
                        value ="${dptDtls.stateLGDCode}";
                        readonly
                      />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >District LGD Code :
                      <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        id="districtlgd"
                        required
                        name="districtLGDCode"
                        value ="${dptDtls.districtLGDCode}";
                        readonly
                      />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Block Code :</label>
                    <div class="panelBoxInput">
                      <input type="text" id="blockcode" name="blockCode" value ="${
                        dptDtls.blockCode
                      }";
                        readonly/>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Village Code :</label>
                    <div class="panelBoxInput">
                      <input type="text" id="villagecode" name="villageCode" value ="${
                        dptDtls.villageCode
                      }";
                        readonly/>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Country Code :</label>
                    <div class="panelBoxInput">
                      <input type="text" id="countrycode" name="countryCode" value ="${
                        dptDtls.countryCode
                      }";
                        readonly/>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Pin Code :</label>
                    <div class="panelBoxInput">
                      <input type="number" id="pin" name="pinCode" value ="${
                        dptDtls.pinCode
                      }";
                        readonly/>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >Gender : <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                    <input
                        type="text"
                        required
                        name="gender"
                        name="mobileNo"
                        value ="${dptDtls.gender}";
                        readonly
                      />
                     
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Date Of Birth :</label>
                    <div class="panelBoxInput">
                        <input
                        type="text"
                        required
                        name="dateofBirth"
                        name="mobileNo"
                        value ="${dptDtls.dateofBirth}";
                        readonly
                      />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >Mobile Number : <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        required
                        maxlength="10"
                        name="mobileNo"
                        value ="${dptDtls.mobileNo}";
                        readonly
                      />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Email :</label>
                    <div class="panelBoxInput">
                      <input type="email" name="email" value ="${
                        dptDtls.email
                      }";
                        readonly/>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >Bank Name : <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                      <input type="text" required name="bankName" value ="${
                        dptDtls.bankName
                      }";
                        readonly/>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >Bank ID(IFSC Code) :
                      <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                      <input type="number" required name="bankId" value ="${
                        dptDtls.bankId
                      }";
                        readonly/>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >Bank Account Number :
                      <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                      <input type="number" required name="bankAcctNumber" value ="${
                        dptDtls.bankAcctNumber
                      }";
                        readonly/>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >Aadhar Number : <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        required
                        maxlength="12"
                        name="adharNo"
                        value ="${dptDtls.adharNo}";
                        readonly
                      />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >Affidavit : <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                      <input type="file" name="file" id="uploadIndividualFile" onchange="uploadFile()" disabled/>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
          <div class="inputContainerThree">
            <button type="button" class="accordion">
              <span>Case Decision</span>
              <i class="fa-sharp fa-solid fa-arrow-down"></i>
            </button>
            <div class="panel">
              <div class="panelBox">
                <label for="">Assigned To :</label>
                <div class="panelBoxInput">
                  <input
                    type="text"
                    placeholder="CTPC Sol ID"
                    name="checker_id"
                    value="${wID.checker_id}"
                    readonly
                  />
                </div>
              </div>
              <div class="panelBox">
                <input
                  style="display: none"
                  type="text"
                  id="checkerEmail"
                  name="checkerEmail"
                  value="${dptDtls.checkerEmail}"
                    readonly
                />
              </div>
            </div>
          </div>
        </article>
        <article class="createWorkIdRight">
          <div class="uploadLinksContainer">
            <h3>Documents Uploaded :</h3>
            <div class="linkcontainer">
             
              <a style="padding: 1rem; font-size: 16px; display: grid; grid-template-columns: auto 1fr; column-gap: 0.5rem; align-items: center;" href="${
                filepath + fArr[0].file_name
              }" target="documentShow"><i style="border: 1px solid red;padding: 0.25rem;border-radius: 50%; color: blue;" class="fa-solid fa-file"></i><span>${
      fArr[0].file_name
    }</span></a>
      
            </div>
          </div>
          <div>
            <iframe
              src=""
              name="documentShow"
              frameborder="0"
              id="documentShow"
            ></iframe>
          </div>
          <div class="submitButtonContainer" style="${
            status === "Verified" || status === "View"
              ? "display: none;"
              : "display: grid"
          }">
            <button type="submit" id="formButton">Approve</button>
            <button type="submit" id="formButton">Reject</button>
            <!-- <button type="submit" id="workidformbutton">Cancel</button> -->
          </div>
        </article>
  `;
  } else if (dpt === "I-CONNECT") {
    depHtml = `<button
          type="button"
          class="closeWorkIdSectionButton"
          id="checkercloseWorkIdSectionButton"
          onclick="closeModal(this)"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
        <article class="createWorkIdLeft">
          <div class="inputContainerOne">
            <div class="box boxOne">
              <label for="">Finacle Reference Number</label>
              <input type="text" readonly name="finacleReferenceNumber" />
            </div>
            <div class="box boxTwo">
              <label for="">Registration Number</label>
              <input
                type="text"
                value="${
                  dptDtls.registrationNumber === null
                    ? ""
                    : dptDtls.registrationNumber
                }"
                readonly
                name="registrationNumber"
              />
            </div>
            <div class="box boxtThree">
              <label for="">Unique Reference Number</label>
              <input
                type="text"
                value="${dptDtls.uniqueReferenceNumber}"
                readonly
                name="uniqueReferenceNumber"
              />
            </div>
          </div>

          <div class="inputContainerThree three">
            <button type="button" class="accordion">
              <span>Branch Info</span>
              <i class="fa-sharp fa-solid fa-arrow-down"></i>
            </button>
            <div class="panel">
              <div class="panelBox">
                <label for=""
                  >Branch Sol ID
                  <span style="margin-left: 10px; color: red">*</span></label
                >
                <div class="panelBoxInput">
                  <input
                    type="text"
                    placeholder="Branch Sol ID"
                    name="branchSolID"
                    value="${dptDtls.branchSolID}"
                    readonly
                  />
                </div>
              </div>
              <div class="panelBox">
                <label for=""
                  >TF Location Sol ID
                  <span style="margin-left: 10px; color: red">*</span></label
                >
                <div class="panelBoxInput">
                  <input
                    type="text"
                    placeholder="TF Location Sol ID"
                    name="tfLocationSolID"
                    value="${dptDtls.tfLocationSolID}"
                    readonly
                  />
                </div>
              </div>
              <div class="panelBox">
                <label for=""
                  >CTPC Sol ID
                  <span style="margin-left: 10px; color: red">*</span></label
                >
                <div class="panelBoxInput">
                  <input
                    type="text"
                    placeholder="CTPC Sol ID"
                    name="ctpcSolID"
                    value="${dptDtls.ctpcSolID}"
                    readonly
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="inputContainerTwo">
            <button type="button" class="accordion">
              <span>Product Information</span>
              <i class="fa-sharp fa-solid fa-arrow-down"></i>
            </button>
            <div class="panel">
              <div class="panelBox">
                <label for=""
                  >Product Category :<span style="margin-left: 10px; color: red"
                    >*</span
                  ></label
                >
                <div class="panelBoxInput">
                  <input
                    type="text"
                    placeholder="CTPC Sol ID"
                    name="ctpcSolID"
                    value="${dptDtls.productCategory}"
                    readonly
                  />
                </div>
              </div>
              <div class="panelBox">
                <label for=""
                  >Product Type :<span style="margin-left: 10px; color: red"
                    >*</span
                  ></label
                >
                <div class="panelBoxInput">
                  <input
                    type="text"
                    placeholder="CTPC Sol ID"
                    name="ctpcSolID"
                    value="${dptDtls.productType}"
                    readonly
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- swift -->
            <div id="swift" class="department">
              <div class="inputContainerThree" style="display: grid">
                <button type="button" class="accordion">
                  <span>Contact Information</span>
                  <i class="fa-sharp fa-solid fa-arrow-down"></i>
                </button>

                <div class="panel">
                  <div class="panelBox" style="align-items: center">
                    <label for="" style="align-self: flex-start"
                      >Initiate Transactions</label
                    >
                  </div>
                  <div class="panelBox">
                    <input
                        type="number"
                        placeholder="Account Number"
                        name="initiate_Transaction"
                        id="initiate_Transaction"
                        value="${dptDtls.initiate_Transaction}"
                        readonly
                      />

                    </div>
                    
                   <div class="panelBox"> 
                    <input
                        type="number"
                        placeholder="Account Number"
                        name="initiate_TransactionTwo"
                        id="initiate_TransactionTwo"
                        value="${dptDtls.initiate_TransactionTwo}"
                        readonly
                      />
                  </div>

                  <div class="panelBox">
                    <label for="">Account Number </label>
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        placeholder="Account Number"
                        name="accountNumber"
                        id="accountNumber"
                        value="${dptDtls.accountNumber}"
                        readonly
                      />
                      
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Identifier Code </label>
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        placeholder="Identifier Code"
                        name="identifierCode"
                        id="identifierCode"
                        value="${dptDtls.identifierCode}"
                        readonly
                      />

                      
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Value Date </label>
                    <div class="panelBoxInput">
                      <input
                        type="date"
                        placeholder="Value Date"
                        name="value_date"
                        id="valueDate"
                        value="${dptDtls.value_date}"
                        readonly
                      />
                      
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Currency</label>
                    
                    <input
                        type="number"
                        placeholder="Interbank Settled Amount"
                        name="currencyCategory"
                        id="currencyCategory"
                        value="${dptDtls.currencyCategory}"
                        readonly
                      />
                  </div>
                  <div class="panelBox">
                    <label for="">Interbank Settled Amount </label>
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        placeholder="Interbank Settled Amount"
                        name="settledAmount"
                        id="settledAmount"
                        value="${dptDtls.settledAmount}"
                        readonly
                      />
                      
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Exchange Rate</label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Exchange Rate"
                        name="exchangeRate"
                        id="exchangeRate"
                        value="${dptDtls.exchangeRate}"
                        readonly
                      />
                    
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Deal ID / Treasury Reference Number</label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Deal ID"
                        name="refNumber"
                        id="refNumber"
                        value="${dptDtls.refNumber}"
                        readonly
                      />
                      
                    </div>
                  </div>
                  <div class="panelBox">
                  
                     <input
                        type="number"
                        placeholder="Account Number"
                        name="selectCategory2"
                        id="selectCategory2"
                        value="${dptDtls.selectCategory2}"
                        readonly
                      />
                  </div>
                  <br />
                  <div class="panelBox">
                    <label for="">Account Number</label>
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        placeholder="Account Number"
                        name="acctNumber"
                        id="acctNumber"
                        value="${dptDtls.acctNumber}"
                        readonly
                      />
                      
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Address</label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Street Address"
                        name="address"
                        id="address"
                          value="${dptDtls.address}"
                        readonly
                      />
                     
                    </div>
                  </div>

                  <div class="panelBox">
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Street Address 1"
                        name="address1"
                        id="address1"
                         id="city"
                         value="${dptDtls.address1}"
                        readonly
                      />
                     
                    </div>
                  </div>

                  <div class="panelBox">
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="City"
                        name="city"
                        id="city"
                         value="${dptDtls.city}"
                        readonly
                      />
                      
                    </div>
                  </div>

                  <div class="panelBox">
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Province"
                        name="province"
                        id="province"
                        
                        value="${dptDtls.province}"
                        readonly
                      />
                      
                    </div>
                  </div>

                  <div class="panelBox">
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        placeholder="Postal Code"
                        name="postalCode"
                        id="postalCode"
                        value="${dptDtls.postalCode}"
                        readonly
                      />
                      
                    </div>
                  </div>

                  <div class="panelBox">
                    
                    <input
                        type="number"
                        placeholder="Currency Code"
                        name="selectCategory3"
                        id="selectCategory3"
                         value="${dptDtls.selectCategory3}"
                        readonly
                      />
            
                  </div>
                  <br />
                  <div class="panelBox">
                    <label for="">Currency Code</label>
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        placeholder="Currency Code"
                        name="currencyCode"
                        id="currencyCode"
                         value="${dptDtls.currencyCode}"
                        readonly
                      />
                      
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Fedwire Number</label>
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        placeholder="Fedwire Number "
                        name="fedwireNumber"
                        id="fedwireNumber"
                         value="${dptDtls.fedwireNumber}"
                        readonly
                      />
                     
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Sort Code</label>
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        placeholder="Sort Code"
                        name="sortCode"
                        id="sortCode"
                        value="${dptDtls.sortCode}"
                        readonly
                      />
                      
                    </div>
                  </div>

                  <div class="panelBox">
                  
                     <input
                        type="text"
                        placeholder="Party Identifier"
                        name="selectCategory4"
                        id="selectCategory4"
                        value="${dptDtls.selectCategory4}"
                        readonly
                      />
                    
                  </div>
                  <br />
                  <div class="panelBox">
                    <label for="">Party Identifier</label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Party Identifier"
                        name="partyIdentifier"
                        id="partyIdentifier"
                        value="${dptDtls.partyIdentifier}"
                        readonly
                      />
                       
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Address</label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Address "
                        name="address2"
                        id="address2"
                        value="${dptDtls.address2}"
                        readonly
                      />
                    
                    </div>
                  </div>

                  <div class="panelBox">
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Street Address 1"
                        name="address3"
                        id="address3"
                        value="${dptDtls.address3}"
                        readonly
                      />
                      
                    </div>
                  </div>

                  <div class="panelBox">
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="City"
                        name="city2"
                        id="city2"
                         value="${dptDtls.city2}"
                        readonly
                      />
                      
                    </div>
                  </div>

                  <div class="panelBox">
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Province"
                        name="province2"
                        id="province2"
                        value="${dptDtls.province2}"
                        readonly
                      />
                      
                    </div>
                  </div>

                  <div class="panelBox">
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        placeholder="Postal Code"
                        name="postalCode2"
                        id="postalCode2"
                        value="${dptDtls.postalCode2}"
                        readonly
                      />
                      
                    </div>
                  </div>

                  <div class="panelBox">
                   
                    <input
                        type="text"
                        placeholder="Party Identifier "
                        name="selectCategory5"
                        id="partyIdentifier2"
                        value="${dptDtls.selectCategory5}"
                        readonly
                      />
                  </div>

                  <div class="panelBox">
                  <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Party Identifier "
                        name="selectCategory6"
                        id="partyIdentifier2"
                        value="${dptDtls.selectCategory6}"
                        readonly
                      />
                  </div>
                  
                  </div>
                  <br />
                  <div class="panelBox">
                    <label for="">Party Identifier</label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Party Identifier "
                        name="partyIdentifier2"
                        id="partyIdentifier2"
                        value="${dptDtls.partyIdentifier2}"
                        readonly
                      />
                      <div class="fail-partyIdentifier2">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Identifier Code</label>
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        placeholder="Identifier Code"
                        name="identifierCode2"
                        id="identifierCode2"
                        value="${dptDtls.identifierCode2}"
                        readonly
                      />
                      <div class="fail-identifierCode2">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >Waive of Charges
                      <!-- <input type="checkbox" name="checkbox" id="checkbox"/> -->
                    </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Waive of Charges"
                        name="waiveCharges"
                        id="waiveCharges"
                         value="${dptDtls.waiveCharges}"
                        readonly
                      />
                      <div class="fail-waiveCharges">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Remittance Information </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Remittance Information "
                        name="Remittance"
                        id="Remittance"
                        value="${dptDtls.Remittance}"
                        readonly
                      />
                      <div class="fail-Remittance">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Bank Operation Code</label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Bank Operation Code"
                        name="operationCode"
                        id="operationCode"
                        value="${dptDtls.operationCode}"
                        readonly
                      />
                      <div class="fail-operationCode">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Cheque Number</label>
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        placeholder="Cheque Number"
                        name="chequeNumber"
                        id="chequeNumber"
                        value="${dptDtls.chequeNumber}"
                        readonly
                      />
                      <div class="fail-chequeNumber">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Supporting Documents</label>
                    <div class="panelBoxInput">
                      <input
                        type="file"
                        placeholder=""
                        name="file"
                        id="uploadIndividualFile" onchange="uploadFile()"
                        required
                        disabled
                      />
                    </div>
                    <div class="panelBoxInput">
                      <input
                        type="file"
                        placeholder=""
                        name="fileTwo"
                        required
                        id="uploadIndividualFile" onchange="uploadFile()"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- swift end -->


          <div class="inputContainerThree">
            <button type="button" class="accordion">
              <span>Case Decision</span>
              <i class="fa-sharp fa-solid fa-arrow-down"></i>
            </button>
            <div class="panel">
              <div class="panelBox">
                <label for="">Assigned To :</label>
                <div class="panelBoxInput">
                  <input
                    type="text"
                    placeholder="CTPC Sol ID"
                    name="checker_id"
                    value="${wID.checker_id}"
                    readonly
                  />
                </div>
              </div>
              <div class="panelBox">
                <input
                  style="display: none"
                  type="text"
                  id="checkerEmail"
                  name="checkerEmail"
                  value="${dptDtls.checkerEmail}"
                    readonly
                />
              </div>
            </div>
          </div>
        </article>
        <article class="createWorkIdRight">
          <div class="uploadLinksContainer">
            <h3>Documents Uploaded :</h3>
            <div class="linkcontainer">
             
              <a style="padding: 0.25rem; font-size: 12px; display: grid; grid-template-columns: auto 1fr; column-gap: 0.5rem; align-items: center;" href="${
                filepath + fArr[0].file_name
              }" target="documentShow"><i style="border: 1px solid red;padding: 0.25rem;border-radius: 50%; color: blue;" class="fa-solid fa-file"></i><span>${
      fArr[0].file_name
    }</span></a>


    <a style="padding: 0.25rem; font-size: 12px; display: grid; grid-template-columns: auto 1fr; column-gap: 0.5rem; align-items: center;" href="${
      filepath + fArr[1].file_name
    }" target="documentShow"><i style="border: 1px solid red;padding: 0.25rem;border-radius: 50%; color: blue;" class="fa-solid fa-file"></i><span>${
      fArr[1].file_name
    }</span></a>
        
            </div>
          </div>
          <div>
            <iframe
              src=""
              name="documentShow"
              frameborder="0"
              id="documentShow"
            ></iframe>
          </div>
          <div class="submitButtonContainer" style="${
            status === "Verified" || status === "View"
              ? "display: none;"
              : "display: grid"
          }">
            <button type="submit" id="formButton">Approve</button>
            <button type="submit" id="formButton">Reject</button>
            <!-- <button type="submit" id="workidformbutton">Cancel</button> -->
          </div>
        </article>
          `;
  } else if (dpt === "TradeFinance" || dpt === "TF" || dpt === "tf") {
    depHtml = `
      <button
          type="button"
          class="closeWorkIdSectionButton"
          id="checkercloseWorkIdSectionButton"
          onclick="closeModal(this)"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
        <article class="createWorkIdLeft">
          <div class="inputContainerOne">
            <div class="box boxOne">
              <label for="">Finacle Reference Number</label>
              <input type="text" readonly name="finacleReferenceNumber" />
            </div>
            <div class="box boxTwo">
              <label for="">Registration Number</label>
              <input
                type="text"
                value="${
                  dptDtls.registrationNumber === null
                    ? ""
                    : dptDtls.registrationNumber
                }"
                readonly
                name="registrationNumber"
              />
            </div>
            <div class="box boxtThree">
              <label for="">Unique Reference Number</label>
              <input
                type="text"
                value="${dptDtls.uniqueReferenceNumber}"
                readonly
                name="uniqueReferenceNumber"
              />
            </div>
          </div>

          <div class="inputContainerThree three">
            <button type="button" class="accordion">
              <span>Branch Info</span>
              <i class="fa-sharp fa-solid fa-arrow-down"></i>
            </button>
            <div class="panel">
              <div class="panelBox">
                <label for=""
                  >Branch Sol ID
                  <span style="margin-left: 10px; color: red">*</span></label
                >
                <div class="panelBoxInput">
                  <input
                    type="text"
                    placeholder="Branch Sol ID"
                    name="branchSolID"
                    value="${dptDtls.branchSolID}"
                    readonly
                  />
                </div>
              </div>
              <div class="panelBox">
                <label for=""
                  >TF Location Sol ID
                  <span style="margin-left: 10px; color: red">*</span></label
                >
                <div class="panelBoxInput">
                  <input
                    type="text"
                    placeholder="TF Location Sol ID"
                    name="tfLocationSolID"
                    value="${dptDtls.tfLocationSolID}"
                    readonly
                  />
                </div>
              </div>
              <div class="panelBox">
                <label for=""
                  >CTPC Sol ID
                  <span style="margin-left: 10px; color: red">*</span></label
                >
                <div class="panelBoxInput">
                  <input
                    type="text"
                    placeholder="CTPC Sol ID"
                    name="ctpcSolID"
                    value="${dptDtls.ctpcSolID}"
                    readonly
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="inputContainerTwo">
            <button type="button" class="accordion">
              <span>Product Information</span>
              <i class="fa-sharp fa-solid fa-arrow-down"></i>
            </button>
            <div class="panel">
              <div class="panelBox">
                <label for=""
                  >Product Category :<span style="margin-left: 10px; color: red"
                    >*</span
                  ></label
                >
                <div class="panelBoxInput">
                  <input
                    type="text"
                    placeholder="CTPC Sol ID"
                    name="ctpcSolID"
                    value="${dptDtls.productCategory}"
                    readonly
                  />
                </div>
              </div>
              <div class="panelBox">
                <label for=""
                  >Product Type :<span style="margin-left: 10px; color: red"
                    >*</span
                  ></label
                >
                <div class="panelBoxInput">
                  <input
                    type="text"
                    placeholder="CTPC Sol ID"
                    name="ctpcSolID"
                    value="${dptDtls.productType}"
                    readonly
                  />
                </div>
              </div>
            </div>
          </div>


          <!--  tf Container-->
            <div id="tradefinance" class="department">
              <!-- customer information -->
              <div class="inputContainerThree">
                <button type="button" class="accordion">
                  <span>Customer Name & Account Information</span>
                  <i class="fa-sharp fa-solid fa-arrow-down"></i>
                </button>
                <div class="panel">
                  <div class="panelBox">
                    <label for=""
                      >Customer Name
                      <span style="margin-left: 10px; color: red"
                        >*</span
                      ></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Branch Sol ID"
                        name="customerName"
                        value="${dptDtls.customerName}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for=""
                      >Account Number
                      <span style="margin-left: 10px; color: red"
                        >*</span
                      ></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Branch Sol ID"
                        name="accountNumber"
                          value="${dptDtls.accountNumber}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for=""
                      >Customer ID
                      <span style="margin-left: 10px; color: red"
                        >*</span
                      ></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Branch Sol ID"
                        name="customerID"
                          value="${dptDtls.customerID}"
                        readonly
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- contact information -->
              <div class="inputContainerThree">
                <button type="button" class="accordion">
                  <span>Contact Information</span>
                  <i class="fa-sharp fa-solid fa-arrow-down"></i>
                </button>
                <div class="panel">
                  <div class="panelBox">
                    <label for="">Telephone Number</label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Telephone Number"
                        name="telephoneNumber"
                         value="${dptDtls.telephoneNumber}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Email </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Contact Person"
                        name="email"
                         value="${dptDtls.email}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Contact Person </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Contact Person"
                        name="contactPerson"
                        value="${dptDtls.contactPerson}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="" style="align-self: flex-start"
                      >Category
                    </label>
                    <div class="panelBoxInput" style="align-self: flex-start">
                     
                      <input
                        type="text"
                        placeholder="constitution"
                        name="category"
                         value="${dptDtls.category}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Vertical </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Branch Sol ID"
                        name="vertical"
                        readonly
                        style="background: lightgrey; outline: none"
                        value="NA"
                        value="${dptDtls.vertical}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Constitution </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="constitution"
                        name="constitution"
                         value="${dptDtls.constitution}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Acount Sol ID </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Acount Sol ID"
                        name="accountSolID"
                        readonly
                        value="979"
                        style="background: lightgrey; outline: none"
                         value="${dptDtls.accountSolID}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Debit/Credit Account ID </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Debit/Credit Account ID"
                        name="debitCreditAccountID"
                        value="${dptDtls.debitCreditAccountID}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Mobile Number </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Mobile Number"
                        name="mobileNumber"
                        value="${dptDtls.mobileNumber}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Limit ID 1 </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Limit ID 1"
                        name="limitID1"
                         value="${dptDtls.limitID1}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox" style="align-self: flex-start">
                    <label for="" style="align-self: flex-start"
                      >Limit ID 2
                    </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Limit ID 2"
                        name="limitID2"
                           value="${dptDtls.limitID2}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Address </label>
                    <div class="panelBoxInput">
                      <textarea
                        name="address"
                        placeholder="type your address"
                        id=""
                        cols="30"
                        rows="10"
                          value="${dptDtls.address}"
                        readonly
                      ></textarea>
                    </div>
                  </div>
                  <div class="panelBox" style="align-self: flex-start">
                    <label for="">IE Ref No </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        name="ieRefNo"
                        readonly
                        value="12345678"
                        style="background: lightgrey; outline: none"
                         value="${dptDtls.ieRefNo}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Trade Customer Flag (Y/N) </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        name="tradeCustomerFlag"
                        readonly
                        value="Y"
                        style="background: lightgrey; outline: none"
                        value="${dptDtls.tradeCustomerFlag}"
                        readonly
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Beneficiary -->
              <div class="inputContainerThree">
                <button type="button" class="accordion">
                  <span>Beneficiary / Other Party</span>
                  <i class="fa-sharp fa-solid fa-arrow-down"></i>
                </button>
                <div class="panel" style="row-gap: 2rem !important">
                  <div class="panelBox">
                    <label for="">Beneficiary/Other Party name </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Beneficiary / Other Party name"
                        name="beneficiaryOtherPartyName"
                        value="${dptDtls.beneficiaryOtherPartyName}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="" style="align-self: flex-start"
                      >Beneficiary / Other Party Country
                    </label>
                    <div class="panelBoxInput" style="align-self: flex-start">
                      
                      <input
                        type="text"
                        placeholder="Beneficiary/Other Party Bank name"
                        name="beneficiaryOtherPartyCountry"
                         value="${dptDtls.beneficiaryOtherPartyCountry}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Beneficiary/Other Party Bank name </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Beneficiary/Other Party Bank name"
                        name="beneficiaryOtherPartyBankName"
                         value="${dptDtls.beneficiaryOtherPartyBankName}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="" style="align-self: flex-start"
                      >Beneficiary / Other Party Bank Country
                    </label>
                    <div class="panelBoxInput" style="align-self: flex-start">
                       <input
                        type="text"
                        placeholder="Beneficiary / Other Party Account Number"
                        name="beneficiaryOtherPartyBankCountry"
                          value="${dptDtls.beneficiaryOtherPartyBankCountry}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Beneficiary Other Party Address </label>
                    <div class="panelBoxInput">
                      <textarea
                        name="beneficiaryOtherPartyAddress"
                        placeholder="type your address"
                        id=""
                        cols="30"
                        rows="10"
                        value="${dptDtls.beneficiaryOtherPartyAddress}"
                        readonly
                      ></textarea>
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Beneficiary Other Party Bank Address </label>
                    <div class="panelBoxInput">
                      <textarea
                        name="beneficiaryOtherPartyBankAddress"
                        placeholder="type beneficiary Other Party Bank Address"
                        id=""
                        cols="30"
                        rows="10"
                         value="${dptDtls.beneficiaryOtherPartyBankAddress}"
                        readonly
                      ></textarea>
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for=""
                      >Beneficiary/Other Party Account Number
                    </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Beneficiary / Other Party Account Number"
                        name="beneficiaryOtherPartyAccoutNumber"
                          value="${dptDtls.beneficiaryOtherPartyAccoutNumber}"
                        readonly
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Product specific information -->
              <div class="inputContainerThree">
                <button type="button" class="accordion">
                  <span>Product Specific Information</span>
                  <i class="fa-sharp fa-solid fa-arrow-down"></i>
                </button>
                <div class="panel">
                  <div class="panelBox">
                    <label for=""
                      >Charges Recoverable Account
                      <span style="margin-left: 10px; color: red"
                        >*</span
                      ></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Charges Recoverable Account"
                        name="chargesRecoverableAccount"
                          value="${dptDtls.chargesRecoverableAccount}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="" style="align-self: flex-start"
                      >BG Currency
                      <span style="margin-left: 10px; color: red"
                        >*</span
                      ></label
                    >
                    <div class="panelBoxInput" style="align-self: flex-start">
                      <input
                        type="text"
                        placeholder="BG Amount"
                        name="bgCurrency"
                        value="${dptDtls.bgCurrency}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for=""
                      >BG Amount
                      <span style="margin-left: 10px; color: red"
                        >*</span
                      ></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="BG Amount"
                        name="bgAmount"
                        value="${dptDtls.bgAmount}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for=""
                      >BG Number
                      <span style="margin-left: 10px; color: red"
                        >*</span
                      ></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="BG Number"
                        name="bgNumber"
                        value="${dptDtls.bgNumber}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Revised Bg Value </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Revised Bg Value "
                        name="revisedBgValue"
                        value="${dptDtls.revisedBgValue}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="" style="align-self: flex-start"
                      >BG Amendement Request
                    </label>
                    <div class="panelBoxInput" style="align-self: flex-start">
                      <input
                        type="text"
                        placeholder="Revised Bg Value "
                        name="bgAmendementRequest"
                        value="${dptDtls.bgAmendementRequest}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="" style="align-self: flex-start"
                      >Additional Margin Reqd</label
                    >
                    <div class="panelBoxInput" style="align-self: flex-start">
              
                      <input
                        type="text"
                        placeholder="Revised Bg Value "
                        name="additionalMarginReqd"
                        value="${dptDtls.additionalMarginReqd}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Revised Bg Expiry Dt </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Revised Bg Value "
                        name="revisedBgExpiryDt"
                        value="${dptDtls.revisedBgClaimExpiryDt}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Revised Bg Expiry Dt </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Revised Bg Value "
                        name="revisedBgClaimExpiryDt"
                        value="${dptDtls.revisedBgClaimExpiryDt}"
                        readonly
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Deferral Section -->
              <div class="inputContainerThree">
                <button type="button" class="accordion">
                  <span>Deferral Section</span>
                  <i class="fa-sharp fa-solid fa-arrow-down"></i>
                </button>
                <div class="panel">
                  <div class="panelBox">
                    <label for="" style="align-self: flex-start"
                      >Deferral Status
                    </label>
                    <div class="panelBoxInput" style="align-self: flex-start">
                      <input
                        type="text"
                        placeholder="Revised Bg Value "
                        name="deferralStatus"
                        value="${dptDtls.deferralStatus}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Deferral Date </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Revised Bg Value "
                        name="deferralDate"
                        value="${dptDtls.deferralDate}"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Deferral Reason </label>
                    <div class="panelBoxInput">
                      <textarea
                        name="deferralReason"
                        placeholder="Deferral Reason"
                        id=""
                        cols="30"
                        rows="10"
                        value="${dptDtls.deferralReason}"
                        readonly
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Case Documents -->
              <div class="inputContainerThree">
                <button type="button" class="accordion">
                  <span>Case Documents Information</span>
                  <i class="fa-sharp fa-solid fa-arrow-down"></i>
                </button>
                <div class="panel">
                  <div class="panelBox">
                    <label for="">Document Receive Date </label>
                    <div class="panelBoxInput">
                      <input
                        type="date"
                        placeholder="Document Receive Date "
                        name="documentRecieveDate"
                        value="${dptDtls.documentRecieveDate}"
                        readonly
                      />
                    </div>
                  </div>
                  <div
                    class="panelBox"
                    style="align-self: flex-start; row-gap: 1rem"
                  >
                    <label for="">Mode of Receipt </label>
                    <div
                      class="panelBoxInput"
                      style="
                        display: grid;
                        grid-template-columns: repeat(4, auto);
                        align-items: center;
                      "
                    >
                      <input
                        type="checkbox"
                        placeholder="Revised B
                        value="${dptDtls.modOfReceipt}"
                        readonly
                        name="modOfReceipt"
                      />
                      <span style="font-size: 12px"
                        >Partial Original or Copy</span
                      >
                      <input type="checkbox" checked name="modOfReceipt"   value="${
                        dptDtls.creditInfoReferenceNo
                      }"
                        readonly/>
                      <span style="font-size: 12px">Original</span>
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Beneficiary Consent File </label>
                    <div class="panelBoxInput">
                      <input
                        type="file"
                        placeholder="Document Receive Date "
                        name="beneficiaryConsentFile"
                        id="uploadIndividualFile" onchange="uploadFile()"
                        disabled
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Deviation Approvals File </label>
                    <div class="panelBoxInput">
                      <input
                        type="file"
                        placeholder="Document Receive Date "
                        name="deviationApprovalsFile"
                        id="uploadIndividualFile" onchange="uploadFile()"
                        disabled
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Guarantee Amendum File </label>
                    <div class="panelBoxInput">
                      <input
                        type="file"
                        placeholder="Document Receive Date "
                        name="guaranteeAmendumFile"
                        id="uploadIndividualFile" onchange="uploadFile()"
                        disabled
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Margin FD Receipt File </label>
                    <div class="panelBoxInput">
                      <input
                        type="file"
                        placeholder="Document Receive Date "
                        name="marginFDReceiptFile"
                        id="uploadIndividualFile" onchange="uploadFile()"
                        disabled
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Others File </label>
                    <div class="panelBoxInput">
                      <input
                        type="file"
                        placeholder="Document Receive Date "
                        name="othersFile"
                        id="uploadIndividualFile" onchange="uploadFile()"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Branch Checklist -->
              <div class="inputContainerThree">
                <button type="button" class="accordion">
                  <span>Branch Checklist</span>
                  <i class="fa-sharp fa-solid fa-arrow-down"></i>
                </button>
                <div class="panel">
                  <div class="panelBox">
                    <button style="background: #02a793" type="button">
                      Branch Checklist
                    </button>
                  </div>
                  <div class="panelBox"></div>
                </div>
              </div>

              <!-- Other Information -->
              <div class="inputContainerThree">
                <button type="button" class="accordion">
                  <span>Other Information</span>
                  <i class="fa-sharp fa-solid fa-arrow-down"></i>
                </button>
                <div class="panel">
                  <div class="panelBox">
                    <label for="">Credit Info Reference No.</label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Telephone Number"
                        name="creditInfoReferenceNo"
                        value="${dptDtls.creditInfoReferenceNo}"
                        readonly
                      />
                    </div>
                  </div>
                  <div
                    class="panelBox"
                    style="align-self: center; row-gap: 1rem"
                  >
                    <div
                      class="panelBoxInput"
                      style="
                        display: grid;
                        grid-template-columns: repeat(4, auto);
                        align-items: center;
                      "
                    >
                      <input
                        type="checkbox"
                        placeholder="Revised Bg Value "
                        name="tradeOne"
                        value="${dptDtls.tradeOne}"
                        readonly
                      />
                      <span style="font-size: 12px"
                        >Trade Online Transaction</span
                      >
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Previous User Notes </label>
                    <div class="panelBoxInput">
                      <textarea
                        name="previousUserNotes"
                        placeholder="type your address"
                        id=""
                        cols="30"
                        rows="10"
                        value="${dptDtls.previousUserNotes}"
                        readonly
                       
                        style="background: lightgrey; outline: none"
                      ></textarea>
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Notes </label>
                    <div class="panelBoxInput">
                      <textarea
                        name="notes"
                        placeholder="type your address"
                        id=""
                        cols="30"
                        rows="10"
                        value="${dptDtls.notes}"
                        readonly
                      ></textarea>
                    </div>
                  </div>
                  <div class="panelBox">
                    <div
                      class="panelBoxInput"
                      style="display: flex; font-size: 12px; color: blue"
                    >
                      <a style="margin-right: 5px" href="" style="color: blue"
                        >Delegation of power
                      </a>
                      <a style="margin-right: 5px" href="" style="color: blue"
                        >Trade Finance Manuals
                      </a>
                      <a href="" style="color: blue">Schedule of Charges </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          <div class="inputContainerThree">
            <button type="button" class="accordion">
              <span>Case Decision</span>
              <i class="fa-sharp fa-solid fa-arrow-down"></i>
            </button>
            <div class="panel">
              <div class="panelBox">
                <label for="">Assigned To :</label>
                <div class="panelBoxInput">
                  <input
                    type="text"
                    placeholder="CTPC Sol ID"
                    name="checker_id"
                    value="${wID.checker_id}"
                    readonly
                  />
                </div>
              </div>
              <div class="panelBox">
                <input
                  style="display: none"
                  type="text"
                  id="checkerEmail"
                  name="checkerEmail"
                  value="${dptDtls.checkerEmail}"
                    readonly
                />
              </div>
            </div>
          </div>
        </article>
        <article class="createWorkIdRight">
          <div class="uploadLinksContainer">
            <h3>Documents Uploaded :</h3>
            <div class="linkcontainer">
             
               <a style="padding: 0.25rem; font-size: 12px; display: grid; grid-template-columns: auto 1fr; column-gap: 0.5rem; align-items: center;" href="${
                 filepath + fArr[0].file_name
               }" target="previewOne"><i style="border: 1px solid red;padding: 0.25rem;border-radius: 50%; color: blue;" class="fa-solid fa-file"></i><span>${
      fArr[0].file_name
    }</span></a>


    <a style="padding: 0.25rem; font-size: 12px; display: grid; grid-template-columns: auto 1fr; column-gap: 0.5rem; align-items: center;" href="${
      filepath + fArr[1].file_name
    }" target="previewOne"><i style="border: 1px solid red;padding: 0.25rem;border-radius: 50%; color: blue;" class="fa-solid fa-file"></i><span>${
      fArr[1].file_name
    }</span></a>

    <a style="padding: 0.25rem; font-size: 12px; display: grid; grid-template-columns: auto 1fr; column-gap: 0.5rem; align-items: center;" href="${
      filepath + fArr[2].file_name
    }" target="previewOne"><i style="border: 1px solid red;padding: 0.25rem;border-radius: 50%; color: blue;" class="fa-solid fa-file"></i><span>${
      fArr[2].file_name
    }</span></a>


    <a style="padding: 0.25rem; font-size: 12px; display: grid; grid-template-columns: auto 1fr; column-gap: 0.5rem; align-items: center;" href="${
      filepath + fArr[3].file_name
    }" target="previewOne"><i style="border: 1px solid red;padding: 0.25rem;border-radius: 50%; color: blue;" class="fa-solid fa-file"></i><span>${
      fArr[3].file_name
    }</span></a>


<a style="padding: 0.25rem; font-size: 12px; display: grid; grid-template-columns: auto 1fr; column-gap: 0.5rem; align-items: center;" href="${
      filepath + fArr[4].file_name
    }" target="previewOne"><i style="border: 1px solid red;padding: 0.25rem;border-radius: 50%; color: blue;" class="fa-solid fa-file"></i><span>${
      fArr[4].file_name
    }</span></a>


            </div>
          </div>
          
            <iframe
              src=""
              name="previewOne"
              id="documentShow"
            ></iframe>
          
          <div class="submitButtonContainer" style="${
            status === "Verified" || status === "View"
              ? "display: none;"
              : "display: grid"
          }">
            <button type="submit" id="formButton">Approve</button>
            <button type="submit" id="formButton">Reject</button>
            <!-- <button type="submit" id="workidformbutton">Cancel</button> -->
          </div>
        </article>
    `;
  }

  console.log(form);
  form.innerHTML = depHtml;
  checkerWorkId.style.display = "grid";
}

function showWorkIdDirectories(i, deptNme) {
  let { name, parent } = i;
  const tree = document.getElementById("tree");
  empty(tree);
  for (let i of items) {
    const li = document.createElement("li");
    li.style.cursor = "pointer";
    li.style.padding = "0.25rem";
    li.innerHTML = `<div> <i style="color: #FFA500; margin-right: 0.25rem" class="fa-solid fa-folder"></i><span>${i["name"]}</span> </div><button type="button"></button>`;
    tree.append(li);
    li.addEventListener("click", function () {
      showIndividualfile(name, parent);
    });
  }
}

function showIndividualfile(data, deptNme) {
  console.log(data);

  const files = document.getElementById("files");
  empty(files);
  if (data.length > 0) {
    for (let j of data) {
      console.log(j);
      showFiles(j.parent, j.name, deptNme);
    }
  } else {
    notyf.error(`${data.parent} is an empty directory`);
  }
}

function empty(element) {
  while (element.firstElementChild) {
    element.firstElementChild.remove();
  }
}

function showFiles(parent, name, deptNme) {
  console.log(parent, name);
  const filesContainer = document.getElementById("files");
  const fileNamePreview = document.getElementById("fileNamePreview");
  let url = `http://localhost:9990/api/download/${deptNme}/workId/${parent}/${name}`;
  console.log(url);
  let li = document.createElement("li");
  li.innerHTML = `<i class="fa-solid fa-file-pdf"></i> <a href="${url}" target="preview">${name}</a>`;
  filesContainer.append(li);
  li.addEventListener("click", function () {
    this.setAttribute("id", "activeDirectory");
    fileNamePreview.innerText = name;
  });
}

async function postData(depart, formdata) {
  let currentDep = "";
  if (depart === "tradefinance") {
    currentDep = depart;
  } else if (depart === "swift") {
    currentDep = depart;
  } else {
    currentDep = depart;
  }
  console.log(currentDep);
  productCategory.value = "";
  departmentContainer.innerHTML = " ";
  let response = await fetch(`http://localhost:9990/api/${currentDep}`, {
    method: "POST",
    body: formdata,
  });

  let body = await response.text();

  if (response.status === 200) {
    console.log(body);
    productCategory.value = "";
  } else {
    alert("failed to fetch");
    productCategory.value = "";
  }
}

let tf = `<!--  tf Container-->
            <div id="tradefinance" class="department">
              <!-- customer information -->
              <div class="inputContainerThree">
                <button type="button" class="accordion">
                  <span>Customer Name & Account Information</span>
                  <i class="fa-sharp fa-solid fa-arrow-down"></i>
                </button>
                <div class="panel">
                  <div class="panelBox">
                    <label for=""
                      >Customer Name
                      <span style="margin-left: 10px; color: red"
                        >*</span
                      ></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Branch Sol ID"
                        name="customerName"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for=""
                      >Account Number
                      <span style="margin-left: 10px; color: red"
                        >*</span
                      ></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Branch Sol ID"
                        name="accountNumber"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for=""
                      >Customer ID
                      <span style="margin-left: 10px; color: red"
                        >*</span
                      ></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Branch Sol ID"
                        name="customerID"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- contact information -->
              <div class="inputContainerThree">
                <button type="button" class="accordion">
                  <span>Contact Information</span>
                  <i class="fa-sharp fa-solid fa-arrow-down"></i>
                </button>
                <div class="panel">
                  <div class="panelBox">
                    <label for="">Telephone Number</label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Telephone Number"
                        name="telephoneNumber"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Email </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Contact Person"
                        name="email"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Contact Person </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Contact Person"
                        name="contactPerson"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="" style="align-self: flex-start"
                      >Category
                    </label>
                    <div class="panelBoxInput" style="align-self: flex-start">
                      <select
                        name="category"
                        id="category"
                        style="align-self: flex-start"
                      >
                        <option value="">Select your category</option>
                        <option value="tf">Trade Finance</option>
                        <option value="iconnect">i-Connect</option>
                        <option value="hr">Human Resource (HR)</option>
                        <option value="glms">GLMS</option>
                        <option value="clms">CLMS</option>
                      </select>
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Vertical </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Branch Sol ID"
                        name="vertical"
                        readonly
                        style="background: lightgrey; outline: none"
                        value="NA"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Constitution </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="constitution"
                        name="constitution"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Acount Sol ID </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Acount Sol ID"
                        name="accountSolID"
                        readonly
                        value="979"
                        style="background: lightgrey; outline: none"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Debit/Credit Account ID </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Debit/Credit Account ID"
                        name="debitCreditAccountID"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Mobile Number </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Mobile Number"
                        name="mobileNumber"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Limit ID 1 </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Limit ID 1"
                        name="limitID1"
                      />
                    </div>
                  </div>
                  <div class="panelBox" style="align-self: flex-start">
                    <label for="" style="align-self: flex-start"
                      >Limit ID 2
                    </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Limit ID 2"
                        name="limitID2"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Address </label>
                    <div class="panelBoxInput">
                      <textarea
                        name="address"
                        placeholder="type your address"
                        id=""
                        cols="30"
                        rows="10"
                      ></textarea>
                    </div>
                  </div>
                  <div class="panelBox" style="align-self: flex-start">
                    <label for="">IE Ref No </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        name="ieRefNo"
                        readonly
                        value="12345678"
                        style="background: lightgrey; outline: none"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Trade Customer Flag (Y/N) </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        name="tradeCustomerFlag"
                        readonly
                        value="Y"
                        style="background: lightgrey; outline: none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Beneficiary -->
              <div class="inputContainerThree">
                <button type="button" class="accordion">
                  <span>Beneficiary / Other Party</span>
                  <i class="fa-sharp fa-solid fa-arrow-down"></i>
                </button>
                <div class="panel" style="row-gap: 2rem !important">
                  <div class="panelBox">
                    <label for="">Beneficiary/Other Party name </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Beneficiary / Other Party name"
                        name="beneficiaryOtherPartyName"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="" style="align-self: flex-start"
                      >Beneficiary / Other Party Country
                    </label>
                    <div class="panelBoxInput" style="align-self: flex-start">
                      <select
                        name="beneficiaryOtherPartyCountry"
                        id="category"
                        style="align-self: flex-start"
                      >
                        <option value="">Select your country</option>
                        <option value="india">India</option>
                        <option value="australia">Australia</option>
                        <option value="norway">Norway</option>
                        <option value="ireland">Ireland</option>
                        <option value="germany">Germany</option>
                      </select>
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Beneficiary/Other Party Bank name </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Beneficiary/Other Party Bank name"
                        name="beneficiaryOtherPartyBankName"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="" style="align-self: flex-start"
                      >Beneficiary / Other Party Bank Country
                    </label>
                    <div class="panelBoxInput" style="align-self: flex-start">
                      <select
                        name="beneficiaryOtherPartyBankCountry"
                        id="category"
                        style="align-self: flex-start"
                      >
                        <option value="">Select your country</option>
                        <option value="india">India</option>
                        <option value="australia">Australia</option>
                        <option value="norway">Norway</option>
                        <option value="ireland">Ireland</option>
                        <option value="germany">Germany</option>
                      </select>
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Beneficiary Other Party Address </label>
                    <div class="panelBoxInput">
                      <textarea
                        name="beneficiaryOtherPartyAddress"
                        placeholder="type your address"
                        id=""
                        cols="30"
                        rows="10"
                      ></textarea>
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Beneficiary Other Party Bank Address </label>
                    <div class="panelBoxInput">
                      <textarea
                        name="beneficiaryOtherPartyBankAddress"
                        placeholder="type beneficiary Other Party Bank Address"
                        id=""
                        cols="30"
                        rows="10"
                      ></textarea>
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for=""
                      >Beneficiary/Other Party Account Number
                    </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Beneficiary / Other Party Account Number"
                        name="beneficiaryOtherPartyAccoutNumber"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Product specific information -->
              <div class="inputContainerThree">
                <button type="button" class="accordion">
                  <span>Product Specific Information</span>
                  <i class="fa-sharp fa-solid fa-arrow-down"></i>
                </button>
                <div class="panel">
                  <div class="panelBox">
                    <label for=""
                      >Charges Recoverable Account
                      <span style="margin-left: 10px; color: red"
                        >*</span
                      ></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Charges Recoverable Account"
                        name="chargesRecoverableAccount"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="" style="align-self: flex-start"
                      >BG Currency
                      <span style="margin-left: 10px; color: red"
                        >*</span
                      ></label
                    >
                    <div class="panelBoxInput" style="align-self: flex-start">
                      <select
                        name="bgCurrency"
                        id="category"
                        style="align-self: flex-start"
                      >
                        <option value="">Select your currency</option>
                        <option value="rupee">Rupee</option>
                        <option value="dollar">Dollar</option>
                        <option value="yuan">Yuan</option>
                        <option value="euro">Euro</option>
                        <option value="hkdollar">HK Dollar</option>
                      </select>
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for=""
                      >BG Amount
                      <span style="margin-left: 10px; color: red"
                        >*</span
                      ></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="BG Amount"
                        name="bgAmount"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for=""
                      >BG Number
                      <span style="margin-left: 10px; color: red"
                        >*</span
                      ></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="BG Number"
                        name="bgNumber"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Revised Bg Value </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Revised Bg Value "
                        name="revisedBgValue"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="" style="align-self: flex-start"
                      >BG Amendement Request
                    </label>
                    <div class="panelBoxInput" style="align-self: flex-start">
                      <select
                        name="bgAmendementRequest"
                        id="category"
                        style="align-self: flex-start"
                      >
                        <option value="">None Selected</option>
                        <option value="allow">Allow</option>
                        <option value="deny">Deny</option>
                      </select>
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="" style="align-self: flex-start"
                      >Additional Margin Reqd</label
                    >
                    <div class="panelBoxInput" style="align-self: flex-start">
                      <select
                        name="additionalMarginReqd"
                        id="category"
                        style="align-self: flex-start"
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Revised Bg Expiry Dt </label>
                    <div class="panelBoxInput">
                      <input
                        type="date"
                        placeholder="Revised Bg Value "
                        name="revisedBgExpiryDt"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Revised Bg Expiry Dt </label>
                    <div class="panelBoxInput">
                      <input
                        type="date"
                        placeholder="Revised Bg Value "
                        name="revisedBgClaimExpiryDt"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Deferral Section -->
              <div class="inputContainerThree">
                <button type="button" class="accordion">
                  <span>Deferral Section</span>
                  <i class="fa-sharp fa-solid fa-arrow-down"></i>
                </button>
                <div class="panel">
                  <div class="panelBox">
                    <label for="" style="align-self: flex-start"
                      >Deferral Status
                    </label>
                    <div class="panelBoxInput" style="align-self: flex-start">
                      <select
                        name="deferralStatus"
                        id="category"
                        style="align-self: flex-start"
                      >
                        <option value="">Select</option>
                        <option value="initiated">Initiatedd</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Deferral Date </label>
                    <div class="panelBoxInput">
                      <input
                        type="date"
                        placeholder="Revised Bg Value "
                        name="deferralDate"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Deferral Reason </label>
                    <div class="panelBoxInput">
                      <textarea
                        name="deferralReason"
                        placeholder="Deferral Reason"
                        id=""
                        cols="30"
                        rows="10"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Case Documents -->
              <div class="inputContainerThree">
                <button type="button" class="accordion">
                  <span>Case Documents Information</span>
                  <i class="fa-sharp fa-solid fa-arrow-down"></i>
                </button>
                <div class="panel">
                  <div class="panelBox">
                    <label for="">Document Receive Date </label>
                    <div class="panelBoxInput">
                      <input
                        type="date"
                        placeholder="Document Receive Date "
                        name="documentRecieveDate"
                      />
                    </div>
                  </div>
                  <div
                    class="panelBox"
                    style="align-self: flex-start; row-gap: 1rem"
                  >
                    <label for="">Mode of Receipt </label>
                    <div
                      class="panelBoxInput"
                      style="
                        display: grid;
                        grid-template-columns: repeat(4, auto);
                        align-items: center;
                      "
                    >
                      <input
                        type="checkbox"
                        placeholder="Revised Bg Value "
                        name="modOfReceipt"
                      />
                      <span style="font-size: 12px"
                        >Partial Original or Copy</span
                      >
                      <input type="checkbox" checked name="modOfReceipt" />
                      <span style="font-size: 12px">Original</span>
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Beneficiary Consent File </label>
                    <div class="panelBoxInput">
                      <input
                        type="file"
                        placeholder="Document Receive Date "
                        name="beneficiaryConsentFile"
                        id="uploadIndividualFile" onchange="uploadFile()"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Deviation Approvals File </label>
                    <div class="panelBoxInput">
                      <input
                        type="file"
                        placeholder="Document Receive Date "
                        name="deviationApprovalsFile"
                        id="uploadIndividualFile" onchange="uploadFile()"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Guarantee Amendum File </label>
                    <div class="panelBoxInput">
                      <input
                        type="file"
                        placeholder="Document Receive Date "
                        name="guaranteeAmendumFile"
                        id="uploadIndividualFile" onchange="uploadFile()"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Margin FD Receipt File </label>
                    <div class="panelBoxInput">
                      <input
                        type="file"
                        placeholder="Document Receive Date "
                        name="marginFDReceiptFile"
                        id="uploadIndividualFile" onchange="uploadFile()"
                      />
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Others File </label>
                    <div class="panelBoxInput">
                      <input
                        type="file"
                        placeholder="Document Receive Date "
                        name="othersFile"
                        id="uploadIndividualFile" onchange="uploadFile()"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Branch Checklist -->
              <div class="inputContainerThree">
                <button type="button" class="accordion">
                  <span>Branch Checklist</span>
                  <i class="fa-sharp fa-solid fa-arrow-down"></i>
                </button>
                <div class="panel">
                  <div class="panelBox">
                    <button style="background: #02a793" type="button">
                      Branch Checklist
                    </button>
                  </div>
                  <div class="panelBox"></div>
                </div>
              </div>

              <!-- Other Information -->
              <div class="inputContainerThree">
                <button type="button" class="accordion">
                  <span>Other Information</span>
                  <i class="fa-sharp fa-solid fa-arrow-down"></i>
                </button>
                <div class="panel">
                  <div class="panelBox">
                    <label for="">Credit Info Reference No.</label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Telephone Number"
                        name="creditInfoReferenceNo"
                      />
                    </div>
                  </div>
                  <div
                    class="panelBox"
                    style="align-self: center; row-gap: 1rem"
                  >
                    <div
                      class="panelBoxInput"
                      style="
                        display: grid;
                        grid-template-columns: repeat(4, auto);
                        align-items: center;
                      "
                    >
                      <input
                        type="checkbox"
                        placeholder="Revised Bg Value "
                        name="tradeOne"
                      />
                      <span style="font-size: 12px"
                        >Trade Online Transaction</span
                      >
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Previous User Notes </label>
                    <div class="panelBoxInput">
                      <textarea
                        name="previousUserNotes"
                        placeholder="type your address"
                        id=""
                        cols="30"
                        rows="10"
                        readonly
                        style="background: lightgrey; outline: none"
                      ></textarea>
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Notes </label>
                    <div class="panelBoxInput">
                      <textarea
                        name="notes"
                        placeholder="type your address"
                        id=""
                        cols="30"
                        rows="10"
                      ></textarea>
                    </div>
                  </div>
                  <div class="panelBox">
                    <div
                      class="panelBoxInput"
                      style="display: flex; font-size: 12px; color: blue"
                    >
                      <a style="margin-right: 5px" href="" style="color: blue"
                        >Delegation of power
                      </a>
                      <a style="margin-right: 5px" href="" style="color: blue"
                        >Trade Finance Manuals
                      </a>
                      <a href="" style="color: blue">Schedule of Charges </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>`;

let clms = `<!-- clms glms -->
            <div id="clms" class="department">
              <div class="inputContainerThree">
                <button type="button" class="accordion">
                  <span>Contact Information</span>
                  <i class="fa-sharp fa-solid fa-arrow-down"></i>
                </button>

                <div class="panel">
                  <div class="panelBox">
                    <label for=""
                      >Customer : <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        id="customer"
                        required
                        name="customerName"
                      />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Beneficiary Title :</label>
                    <div class="panelBoxInput">
                      <input type="text" name="beneficiaryTitle" />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >Beneficary Name :
                      <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        id="beneficaryname"
                        required
                        name="beneficiaryName1"
                      />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >Beneficary Name
                      <span style="font-size: 10px">(local language)</span>
                      :</label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        id="localname"
                        name="beneficiaryName2"
                      />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >Address Line 1 : <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        id="address"
                        required
                        name="addressLine1"
                      />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >State LGD Code : <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        id="statelgd"
                        required
                        name="stateLGDCode"
                      />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >District LGD Code :
                      <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        id="districtlgd"
                        required
                        name="districtLGDCode"
                      />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Block Code :</label>
                    <div class="panelBoxInput">
                      <input type="text" id="blockcode" name="blockCode" />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Village Code :</label>
                    <div class="panelBoxInput">
                      <input type="text" id="villagecode" name="villageCode" />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Country Code :</label>
                    <div class="panelBoxInput">
                      <input type="text" id="countrycode" name="countryCode" />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Pin Code :</label>
                    <div class="panelBoxInput">
                      <input type="number" id="pin" name="pinCode" />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >Gender : <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                      <select name="gender" id="productCategory" required>
                        <option value="">Select your category</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Date Of Birth :</label>
                    <div class="panelBoxInput">
                      <input type="date" name="dateofBirth" />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >Mobile Number : <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        required
                        maxlength="10"
                        name="mobileNo"
                      />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Email :</label>
                    <div class="panelBoxInput">
                      <input type="email" name="email" />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >Bank Name : <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                      <input type="text" required name="bankName" />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >Bank ID(IFSC Code) :
                      <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                      <input type="number" required name="bankId" />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >Bank Account Number :
                      <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                      <input type="number" required name="bankAcctNumber" />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >Aadhar Number : <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        required
                        maxlength="12"
                        name="adharNo"
                      />
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >Affidavit : <span style="color: red">*</span></label
                    >
                    <div class="panelBoxInput">
                      <input type="file" name="file" id="uploadIndividualFile" onchange="uploadFile()"/>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          
`;

let swift = ` <!-- swift -->
            <div id="swift" class="department">
              <div class="inputContainerThree" style="display: grid">
                <button type="button" class="accordion">
                  <span>Contact Information</span>
                  <i class="fa-sharp fa-solid fa-arrow-down"></i>
                </button>

                <div class="panel">
                  <div class="panelBox" style="align-items: center">
                    <label for="" style="align-self: flex-start"
                      >Initiate Transactions</label
                    >
                  </div>
                  <div class="panelBox" style="display: flex">
                    <select
                      name="initiate_Transaction"
                      id="productCategory2"
                      value="EMPTY"
                      style="margin-right: 10px"
                    >
                      <option selected disabled value="">
                        Select your type
                      </option>
                      <option value="MT103">MT103</option>
                      <option value="BG_MT103">BG MT103</option>
                      <option value="BG_WORKID">BG WORKID</option>
                    </select>
                    <div class="fail-productCategory2">
                      <i
                        class="fa fa-exclamation-circle"
                        aria-hidden="true"
                      ></i>
                      <p>Select the field</p>
                    </div>
                    <select
                      name="initiate_TransactionTwo"
                      id="selectCategory"
                      value=""
                    >
                      <option selected disabled value="">
                        Select your type
                      </option>
                      <option value="MT103">MT103</option>
                      <option value="n">BG SETTLE</option>
                      <option value="d">BG WORKID</option>
                    </select>
                    <div class="fail-selectCategory">
                      <i
                        class="fa fa-exclamation-circle"
                        aria-hidden="true"
                      ></i>
                      <p>Select the field</p>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Account Number </label>
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        placeholder="Account Number"
                        name="accountNumber"
                        id="accountNumber"
                      />
                      <div class="fail-accountNumber">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Identifier Code </label>
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        placeholder="Identifier Code"
                        name="identifierCode"
                        id="identifierCode"
                      />
                      <div class="fail-identifierCode">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Value Date </label>
                    <div class="panelBoxInput">
                      <input
                        type="date"
                        placeholder="Value Date"
                        name="value_date"
                        id="valueDate"
                      />
                      <div class="fail-valueDate">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Currency</label>
                    <select name="" id="currencyCategory" value="">
                      <option selected disabled value="">
                        Select your type
                      </option>
                      <option value="MT103">MT103</option>
                      <option value="SETTLE">BG SETTLE</option>
                    </select>
                    <div class="fail-currencyCategory">
                      <i
                        class="fa fa-exclamation-circle"
                        aria-hidden="true"
                      ></i>
                      <p>Select the field</p>
                    </div>
                  </div>
                  <div class="panelBox">
                    <label for="">Interbank Settled Amount </label>
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        placeholder="Interbank Settled Amount"
                        name="settledAmount"
                        id="settledAmount"
                      />
                      <div class="fail-settledAmount">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Exchange Rate</label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Exchange Rate"
                        name="exchangeRate"
                        id="exchangeRate"
                      />
                      <div class="fail-exchangeRate">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Deal ID / Treasury Reference Number</label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Deal ID"
                        name="refNumber"
                        id="refNumber"
                      />
                      <div class="fail-refNumber">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>
                  <div class="panelBox">
                    <select name="" id="selectCategory2" value="">
                      <option selected disabled value="">
                        Select your type
                      </option>
                      <option value="tradefinance">MT103</option>
                      <option value="SETTLE">BG SETTLE</option>
                    </select>
                    <div class="fail-selectCategory2">
                      <i
                        class="fa fa-exclamation-circle"
                        aria-hidden="true"
                      ></i>
                      <p>Select the field</p>
                    </div>
                  </div>
                  <br />
                  <div class="panelBox">
                    <label for="">Account Number</label>
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        placeholder="Account Number"
                        name="acctNumber"
                        id="acctNumber"
                      />
                      <div class="fail-acctNumber">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Address</label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Street Address"
                        name="address"
                        id="address"
                      />
                      <div class="fail-address">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Street Address 1"
                        name="address1"
                        id="address1"
                      />
                      <div class="fail-address1">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="City"
                        name="city"
                        id="city"
                      />
                      <div class="fail-city">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Province"
                        name="province"
                        id="province"
                      />
                      <div class="fail-province">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        placeholder="Postal Code"
                        name="postalCode"
                        id="postalCode"
                      />
                      <div class="fail-postalCode">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <select name="" id="selectCategory3" value="">
                      <option selected disabled value="">
                        Select your type
                      </option>
                      <option value="MT103">MT103</option>
                      <option value="SETTLE">BG SETTLE</option>
                    </select>
                    <div class="fail-selectCategory3">
                      <i
                        class="fa fa-exclamation-circle"
                        aria-hidden="true"
                      ></i>
                      <p>Select the field</p>
                    </div>
                  </div>
                  <br />
                  <div class="panelBox">
                    <label for="">Currency Code</label>
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        placeholder="Currency Code"
                        name="currencyCode"
                        id="currencyCode"
                      />
                      <div class="fail-currencyCode">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Fedwire Number</label>
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        placeholder="Fedwire Number "
                        name="fedwireNumber"
                        id="fedwireNumber"
                      />
                      <div class="fail-fedwireNumber">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Sort Code</label>
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        placeholder="Sort Code"
                        name="sortCode"
                        id="sortCode"
                      />
                      <div class="fail-sortCode">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <select name="" id="selectCategory4" value="">
                      <option selected disabled value="">
                        Select your type
                      </option>
                      <option value="MT103">MT103</option>
                    </select>
                    <div class="fail-selectCategory4">
                      <i
                        class="fa fa-exclamation-circle"
                        aria-hidden="true"
                      ></i>
                      <p>Select the field</p>
                    </div>
                  </div>
                  <br />
                  <div class="panelBox">
                    <label for="">Party Identifier</label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Party Identifier"
                        name="partyIdentifier"
                        id="partyIdentifier"
                      />
                      <div class="fail-partyIdentifier">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Address</label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Address "
                        name="address2"
                        id="address2"
                      />
                      <div class="fail-address2">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Street Address 1"
                        name="address3"
                        id="address3"
                      />
                      <div class="fail-address3">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="City"
                        name="city2"
                        id="city2"
                      />
                      <div class="fail-city2">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Province"
                        name="province2"
                        id="province2"
                      />
                      <div class="fail-province2">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        placeholder="Postal Code"
                        name="postalCode2"
                        id="postalCode2"
                      />
                      <div class="fail-postalCode2">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <select name="" id="selectCategory5" value="">
                      <option selected disabled value="">
                        Select your type
                      </option>
                      <option value="MT103">MT103</option>
                      <option value="SETTLE">BG SETTLE</option>
                    </select>
                    <div class="fail-selectCategory5">
                      <i
                        class="fa fa-exclamation-circle"
                        aria-hidden="true"
                      ></i>
                      <p>Select the field</p>
                    </div>
                  </div>

                  <div class="panelBox">
                    <select name="" id="selectCategory6" value="">
                      <option selected disabled value="">
                        Select your type
                      </option>
                      <option value="MT103">MT103</option>
                    </select>
                    <div class="fail-selectCategory6">
                      <i
                        class="fa fa-exclamation-circle"
                        aria-hidden="true"
                      ></i>
                      <p>Select the field</p>
                    </div>
                  </div>
                  <br />
                  <div class="panelBox">
                    <label for="">Party Identifier</label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Party Identifier "
                        name="partyIdentifier2"
                        id="partyIdentifier2"
                      />
                      <div class="fail-partyIdentifier2">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Identifier Code</label>
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        placeholder="Identifier Code"
                        name="identifierCode2"
                        id="identifierCode2"
                      />
                      <div class="fail-identifierCode2">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for=""
                      >Waive of Charges
                      <!-- <input type="checkbox" name="checkbox" id="checkbox"/> -->
                    </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Waive of Charges"
                        name="waiveCharges"
                        id="waiveCharges"
                      />
                      <div class="fail-waiveCharges">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Remittance Information </label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Remittance Information "
                        name="Remittance"
                        id="Remittance"
                      />
                      <div class="fail-Remittance">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Bank Operation Code</label>
                    <div class="panelBoxInput">
                      <input
                        type="text"
                        placeholder="Bank Operation Code"
                        name="operationCode"
                        id="operationCode"
                      />
                      <div class="fail-operationCode">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Cheque Number</label>
                    <div class="panelBoxInput">
                      <input
                        type="number"
                        placeholder="Cheque Number"
                        name="chequeNumber"
                        id="chequeNumber"
                      />
                      <div class="fail-chequeNumber">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <p>Field cannot be empty</p>
                      </div>
                    </div>
                  </div>

                  <div class="panelBox">
                    <label for="">Supporting Documents</label>
                    <div class="panelBoxInput">
                      <input
                        type="file"
                        placeholder=""
                        name="file"
                        id="uploadIndividualFile" onchange="uploadFile()"
                        required
                      />
                    </div>
                    <div class="panelBoxInput">
                      <input
                        type="file"
                        placeholder=""
                        name="fileTwo"
                        required
                        id="uploadIndividualFile" onchange="uploadFile()"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- swift end -->`;

let departmentContainer = document.getElementById("departmentContainer");

let productCategory = document.getElementById("productCategory");

productCategory.addEventListener("change", function () {
  let id = this.value;
  if (id === "tradefinance") {
    departmentContainer.innerHTML = tf;
  } else if (id === "clms") {
    departmentContainer.innerHTML = clms;
  } else {
    departmentContainer.innerHTML = swift;
  }
  checkerDetails(id);
});

let workidform = document.getElementById("workidform");

workidform.addEventListener("submit", async function (e) {
  e.preventDefault();
  let loaderContainer = document.querySelector(".loaderContainer");
  loaderContainer.style.display = "grid";
  setTimeout(() => {
    createWorkIdFolder().then((body) => {
      let linkcontainer = document.querySelector(".linkcontainer");
      empty(linkcontainer);
      loaderContainer.style.display = "none";
      let { work_id, dept_name } = body;
      notyf.success(
        `${work_id} created successfully inside ${dept_name}/workID/  folder.`
      );
      notyf.success("Reloading the page....");
      workidform.reset();
      departmentContainer.innerHTML = "";
      createWorkId.style.display = "none";
      setTimeout(() => {
        location.reload();
      }, 10000);
    });
  }, 4000);
});

async function createWorkIdFolder() {
  let formdata = new FormData(workidform);
  let deptmnt = formdata.get("productCategory");
  let js = Object.fromEntries(formdata);
  console.log(js);
  console.log(deptmnt);
  if (deptmnt === "iconnect") {
    deptmnt = "swift";
  }

  let response = await fetch(`http://localhost:9990/api/${deptmnt}`, {
    method: "POST",
    body: formdata,
  });
  let body = await response.json();
  if (response.status === 200) {
    return body;
  } else {
    alert("failed to create workId");
    notyf.error(`Failed to create workId for ${deptmnt}`);
    return null;
  }
}

async function uploadFile() {
  let uploadIndividualFile = document.getElementById("uploadIndividualFile");
  let file = uploadIndividualFile.files[0];
  console.log(uploadIndividualFile);
  let formData = new FormData();
  formData.append("file", file);
  let d = Object.fromEntries(formData);
  console.log(d);
  let response = await fetch(`http://localhost:9990/api/upload`, {
    method: "post",
    body: formData,
  });
  let body = await response.json();
  if (response.status === 200) {
    let link = body.link;
    let filename = body.filename;
    console.log(filename);
    let linkcontainer = document.querySelector(".linkcontainer");
    let a = document.createElement("a");
    a.setAttribute("href", link);
    a.setAttribute("target", "documentShow");
    a.style.padding = "0.25rem";
    a.innerHTML = `<i class="fa-solid fa-file-pdf" style="font-size: 1.25rem;"></i><span style="padding-left: 0.5rem; font-size:16px;">${filename}</span>`;
    linkcontainer.append(a);
  }
}
