var update = Vue.component('update', {
    template:
        `
    <div>
      neeraj bhat
     </div>
  
    `
})

Vue.component('component-security', {
    data: function () {
        return {
            gus: [],
            filterlist: this.securityData,
            parent_id_SearchFieldsEquity: [],
            parent_id_SearchFieldsBond: [],
            data: this.securityData,
            Selected: [],
            SearchFieldsEquity: ['ISIN'],
            SearchFieldsBond: ['ISIN'],
        }
    },

    props: ['header', 'securityData', 'tab'],
    components: {
        'update': update
    },
    computed: {
        filterlist() {

        }
    },

    watch: {
        parent_id_SearchFieldsEquity: function () {

            if (this.parent_id_SearchFieldsEquity[0]) {
                this.data = this.filterlist.filter(element => {
                    if (this.parent_id_SearchFieldsEquity[0]) {
                        if (element.ISIN)
                            return element.ISIN.includes(this.parent_id_SearchFieldsEquity[0])
                        else
                            return false;
                    }
                    else
                        return;

                })
            }
            else
                this.data = this.filterlist

        },
        parent_id_SearchFieldsBond: function () {
            if (this.parent_id_SearchFieldsBond[0]) {
                this.data = this.filterlist.filter(element => {
                    if (this.parent_id_SearchFieldsBond[0]) {
                        if (element.ISIN)
                            return element.ISIN.includes(this.parent_id_SearchFieldsBond[0])
                        else
                            return false;
                    }
                    else
                        return;

                })
            }
            else
                this.data = this.filterlist
        },
        Selected: function () {
            console.log(this.Selected)
        }

    },

    template: `
    <div >
        <div>
            
                
              <form v-show="tab=='Equity'" class="form-inline" style =" margin-left: 41%;">
                
                    <span v-for ="(value,index) in SearchFieldsEquity" style="margin-left   :2%"> 
                        <input type="text" class="form-control" v-model ="parent_id_SearchFieldsEquity[index]" v-bind:placeholder="value"/>
                    </span>   
                    <button type="button" class="btn btn-info" v-on:click="ResetInput()" style="margin-left   :2%">Reset</button>  
              </form>
           
              <form v-show="tab=='Bond'" class="form-inline" style ="margin-bottom : 0% ;margin-left: 41%;">
                
                    <span v-for ="(value,index) in SearchFieldsBond" style="margin-left   :2%">
                        <input type="text" class="form-control" v-model ="parent_id_SearchFieldsBond[index]"  v-bind:placeholder="value"/>
                    </span> 
                    <button type="button" class="btn btn-info" v-on:click="ResetInput()" style="margin-left   :2%"><b>Reset</b></button>     
              </form>
           
        <span style ="margin-left:40% ">
        <button type="button" class="btn btn-info" v-on:click="DeleteMultipleSecurities" style="margin-top:2%">Delete Multiple
        Securities</button>
        <button type="button" data-toggle="modal"  class="btn btn-info" @click="InsertSecurity()" style="margin-top:2%" data-target="#exampleModal">
        Insert Security  
        </button>
        </span>
        <table class="table table-striped table-dark" v-if="this.data.length>0">
            <thead>
                <tr>
                    <th>Checkbox</th>
                    <th>Delete Security</th>
                    <th v-for="header in header"> {{header.toUpperCase()}} </th>
                </tr>
            </thead>
            <tbody>

                <tr v-for="(column, index) in data">
                    <td> <input type="checkbox" class="checkbox" v-model="Selected[index]" /></td>
                    <td ><button type="button" class="btn btn-sm btn-danger"  v-on:click="DeleteSingleSecurity(tab,index,data[index].SecurityID)"><i class="fa fa-trash-o"
                                aria-hidden="true"></i></button>
                                <button type="button" style="margin-top:2%" class="btn btn-sm btn-info"  v-on:click="UpdateSecurity(index,data[index].SecurityID)"><i class="fa fa-edit"></i>
                                </button>        
                                </td>
                    <td v-for="(value, propertyName) in column"> {{ value }}</td>
                                     
                </tr>
            </tbody>
        </table>
        </div>
    
        </div>
        
    `,
    methods: {

        Demo: function () {
            this.BootBoxSuccessMessage("Delete Operation Successful")
        },
        BootboxDestroy: function () {
            window.setTimeout(function () {
                bootbox.hideAll();
            }, 2000);
        },

        InsertSecurity: function () {
            var p = "<form id='insert'>";
            if (this.tab == "Equity") {
                for (item in this.header) {
                    if (item == 0) continue
                    var j = "inp" + item;
                    int_cols = [5, 20, 3, 4, 14]
                    float_cols = [17, 21, 22, 23, 24, 25, 26, 27, 49, 50, 51, 52, 53, 54, 55, 60, 61]
                    var type = "text";
                    if (int_cols.includes(Number(item)) || float_cols.includes(Number(item))) { type = "number" }
                    if (item != 3 && item != 4 && item != 14)
                        p = p + "<div>" + this.header[item] + "</div><input type=" + type + " autocomplete='off' id=" + j + "/></br>"
                }
                p = p + "</form";
            }
            else {
                for (item in this.header) {
                    if (item == 0) continue
                    var j = "inp" + item;
                    int_cols = [15, 19, 20, 21, 29]
                    float_cols = [5, 6, 16, 25, 26, 28, 30, 31, 32, 33, 34, 54, 55, 56, 57, 58, 59, 60, 61, 63]
                    var type = "text";
                    if (int_cols.includes(Number(item)) || float_cols.includes(Number(item))) { type = "number" }
                    if (item != 19 && item != 20 && item != 21 && item != 29)
                        p = p + "<div>" + this.header[item] + "</div><input type=" + type + " autocomplete='off' id=" + j + "/></br>"
                }
                p = p + "</form";
            }



            bootbox.confirm({
                title: "Insert Security",
                message: p,
                // centerVertical: true,
                callback: result => {

                    if (result) {
                        var id = -1;
                        for (i in this.data) {
                            if (this.data[i]["SecurityID"] > id)
                                id = this.data[i]["SecurityID"];
                        }
                        id++;
                        var obj = {};
                        for (i in this.header) {
                            if (i != 0) {

                                var idd = "inp" + i + '/'
                                if (this.tab == "Bond") {
                                    if (i == 19 || i == 20 || i == 21 || i == 29)
                                        obj[this.header[i]] = ""
                                    else
                                        obj[this.header[i]] = document.getElementById(idd).value;
                                }
                                else {
                                    if (i == 3 || i == 4 || i == 14)
                                        obj[this.header[i]] = ""
                                    else
                                        obj[this.header[i]] = document.getElementById(idd).value;
                                }

                            }
                            else
                                obj[this.header[i]] = String(id);
                        }

                        console.log(obj)
                        window.obj = obj
                        if (this.tab == "Bond") {

                            if (document.getElementById('inp1/').value == "" || document.getElementById('inp22/').value == "" || document.getElementById('inp12/').value == "" || document.getElementById('inp2/').value == "") {
                                bootbox.alert("Please insert values for Security Name,Issue Date, First Coupon Date,Security Description");

                            }


                            else {
                                axios({
                                    method: 'post',
                                    url: 'https://localhost:5001/SQLHandler/Bond/Insert',
                                    data: obj,
                                    headers: {},

                                }).then(res => {
                                    if (res.data.statusCode == 200) {
                                        this.data.push(obj);
                                        this.BootBoxSuccessMessage("Insert Operation Successful");
                                        this.BootboxDestroy();
                                    }
                                    else {
                                        this.BootBoxErrorMessage("Something wrong happened while Insert Operation")
                                        this.BootboxDestroy();
                                    }
                                }).catch(err => {
                                    this.BootBoxErrorMessage("Something wrong happened while Insert Operation")
                                    this.BootboxDestroy();
                                })
                            }
                        }
                        else {

                            if (document.getElementById('inp1/').value == "" || document.getElementById('inp11/').value == "" || document.getElementById('inp2/').value == "") {
                                bootbox.alert("Please insert values for Security Name, Bloomberg_Unique_ID ,Security Description");

                            }


                            else {

                                axios({
                                    method: 'post',
                                    url: 'https://localhost:5001/SQLHandler/Equity/Insert',
                                    data: obj,
                                    headers: {},

                                }).then(res => {
                                    if (res.data.statusCode == 200) {
                                        this.BootBoxSuccessMessage("Insert Operation Successful")
                                        this.data.push(obj);
                                        this.BootboxDestroy();
                                    }
                                    else {
                                        this.BootBoxErrorMessage("Something wrong happened while Insert Operation")
                                        this.BootboxDestroy();
                                    }
                                }).catch(err => {
                                    this.BootBoxErrorMessage("Something wrong happened while Insert Operation")
                                    this.BootboxDestroy();
                                })
                            }
                        }
                    }
                }


            })

        },

        UpdateFormEquity: function (index, SID) {
            var Security_Name = this.data[index].Security_Name
            console.log(index)
            console.log(this.data)
            var msg = "<form id='update'>\
            <div>Security_Name  <input type='text'  class='bootboxInput'/></div><br/>\
            <div>Security_Description <input type='text'  class='bootboxInput'/></div><br/>\
            <div>Shares_Per_ADR	<input type='number'  class='bootboxInput'/></div><br/>\
            <div>Total_Shares_Outstanding<input type ='number' step='0.01'  class='bootboxInput'/></div>\
            </form>"
            var SName, shares, total_shares, SDes;
            var title = "Update Security " + this.tab + "with Security ID : " + SID
            bootbox.confirm({
                message: msg,
                title: title,
                centerVertical: true,
                callback: result => {
                    if (result) {
                        window.form = document.getElementById('update')
                        var form = window.form
                        SName = form[0].value
                        if (SName == "")
                            SName = this.data[index].Security_Name
                        shares = form[2].value
                        if (shares == "")
                            shares = this.data[index].Shares_Per_ADR

                        total_shares = form[3].value
                        if (total_shares == "")
                            total_shares = this.data[index].Total_Shares_Outstanding
                        SDes = form[1].value
                        if (SDes == "")
                            SDes = this.data[index].Security_Description
                        axios.get('https://localhost:5001/SQLHandler/Equity/Update',
                            {
                                params: {
                                    SID: SID,
                                    SDes: SDes,
                                    SName: SName,
                                    shares: shares,
                                    total_shares: total_shares
                                }

                            }).then(res => {
                                window.response = res
                                if (res.data.statusCode == 200) {
                                    this.data[index].Security_Name = SName
                                    this.data[index].Security_Description = SDes
                                    this.data[index].Shares_Per_ADR = shares
                                    this.data[index].Total_Shares_Outstanding = total_shares
                                    this.BootBoxSuccessMessage("Update Operation Successful");
                                    this.BootboxDestroy()
                                }
                                else {
                                    this.BootBoxErrorMessage("Something wrong happened while Update Operation")
                                    this.BootboxDestroy();
                                }

                            })
                            .catch(error => {
                                console.log(error);
                                this.BootBoxErrorMessage("Something wrong happened while Update Operation")
                                this.BootboxDestroy();
                            });



                    }


                }
            });


        },
        UpdateFormBond: function (index, SID) {
            var Security_Name = this.data[index].Security_Name
            console.log(index)
            console.log(this.data)
            var msg = "<form id='update'>\
            <div>Security_Name  <input type='text'  class='bootboxInput'/ ></div><br/>\
            <div>Security_Description <input type='text' class='bootboxInput'/></div><br/>\
            <div>Coupon Frequency	<input type='number'  class='bootboxInput'/></div><br/>\
            <div>Call Notification Max Days<input type ='number' step='0.01'  class='bootboxInput'/></div>\
            </form>"
            var SName, COUPON_FREQUENCY, CALL_NOTIFICATION_MAX_DAYS, SDes;
            var title = "Update Security " + this.tab + " with Security ID : " + SID
            bootbox.confirm({
                message: msg,
                title: title,
                centerVertical: true,
                callback: result => {
                    if (result) {
                        window.form = document.getElementById('update')
                        var form = window.form
                        SName = form[0].value
                        if (SName == "")
                            SName = this.data[index].Security_Name

                        SDes = form[1].value
                        if (SDes == "")
                            SDes = this.data[index].Security_Description

                        COUPON_FREQUENCY = form[2].value
                        if (COUPON_FREQUENCY == "")
                            COUPON_FREQUENCY = this.data[index].COUPON_FREQUENCY

                        CALL_NOTIFICATION_MAX_DAYS = form[3].value
                        if (CALL_NOTIFICATION_MAX_DAYS == "")
                            CALL_NOTIFICATION_MAX_DAYS = this.data[index].CALL_NOTIFICATION_MAX_DAYS

                        axios.get('https://localhost:5001/SQLHandler/Bond/Update',
                            {
                                params: {
                                    SID: SID,
                                    SDes: SDes,
                                    SName: SName,
                                    freq: COUPON_FREQUENCY,
                                    notification: CALL_NOTIFICATION_MAX_DAYS
                                }

                            }).then(res => {
                                window.response = res;
                                if (res.data.statusCode == 200) {
                                    this.data[index].Security_Name = SName
                                    this.data[index].Security_Description = SDes
                                    this.data[index].COUPON_FREQUENCY = COUPON_FREQUENCY
                                    this.data[index].CALL_NOTIFICATION_MAX_DAYS = CALL_NOTIFICATION_MAX_DAYS
                                    this.BootBoxSuccessMessage("Update Operation Successful")
                                    this.BootboxDestroy()
                                }
                                else {
                                    this.BootBoxErrorMessage("Something wrong happened while Update Operation")
                                    this.BootboxDestroy();
                                }

                            })
                            .catch(error => {
                                console.log(error);
                                this.BootBoxErrorMessage("Something wrong happened while Update Operation")
                                this.BootboxDestroy()
                            });



                    }


                }
            });

        },
        UpdateSecurity: function (index, SID) {
            if (this.tab == "Equity")
                this.UpdateFormEquity(index, SID);
            else
                this.UpdateFormBond(index, SID);

        },

        CheckBox: function (ID) {
            const index = this.Selected.indexOf(ID);
            if (index > -1) {
                this.Selected.splice(index, 1);
            }
            else {
                this.Selected.push(ID)
            }
            console.log(this.Selected)
        },
        DeleteMultipleSecurities: function () {
            if (this.Selected.length == 0) {
                bootbox.alert({
                    size: "small",
                    title: `
                        <i  style="  margin-left: 13vh " class="fa fa-exclamation-triangle"></i>`,
                    message: `<b style="font-family:inherit">Please select atleast one security.</b>`,
                    callback: function () { /* your callback code */ }
                })
            }

            else {
                var CheckBoxSelected = false
                for (sel in this.Selected) {
                    if (this.Selected[sel]) CheckBoxSelected = true;
                }
                if (CheckBoxSelected) {
                    bootbox.confirm({
                        size: "small",
                        message: `<b style="font-family:inherit">Are you sure you want to delete Multiple Securities?  </b>`,
                        callback: result => {
                            if (result) {
                                window.Selected = this.Selected
                                var xhttp = new XMLHttpRequest()
                                var url = "";
                                if (this.tab == "Equity")
                                    url = "https://localhost:5001/SQLHandler/Equity/delete"
                                else
                                    url = 'https://localhost:5001/SQLHandler/Bond/delete'

                                var length = this.Selected.length;
                                var index = [];
                                for (i = 0; i < length; i++) {
                                    console.log(i)
                                    console.log(this.Selected[i])
                                    console.log(this.data[i].SecurityID)

                                    if (typeof (this.Selected[i]) == "undefined")
                                        continue;
                                    else (this.Selected[i])
                                    {
                                        xhttp.open('GET', url + "?id=" + this.data[i].SecurityID, false)
                                        xhttp.send()
                                        ID = this.data[i].SecurityID
                                        if (xhttp.status == 200) {

                                            //this.data.splice(i,1);
                                            index.push(i);

                                        }
                                        else {
                                            this.BootBoxErrorMessage("Security ID " + ID + " Could not be deleted")
                                            this.BootboxDestroy();
                                        }
                                    }

                                }
                                localData = []
                                this.data = this.data.map((val, idx) => {
                                    if (!index.includes(idx))
                                        localData.push(val)
                                })
                                this.data = localData;
                                console.log(localData)
                                this.BootBoxSuccessMessage("Multiple Delete Operation Successful!")
                                this.BootboxDestroy();

                            }
                            this.Selected = []
                        }
                    })
                }
                else {
                    bootbox.alert({
                        size: "small",
                        title: `
                            <i  style="  margin-left: 13vh " class="fa fa-exclamation-triangle"></i>`,
                        message: `<b style="font-family:inherit">Please select atleast one security.</b>`,
                        callback: function () { /* your callback code */ }
                    })
                }
            }
        },
        ResetInput: function () {
            console.log(this.form)
            if (this.tab === "Equity")
                this.parent_id_SearchFieldsEquity = []
            else
                this.parent_id_SearchFieldsBond = []
        },
        BootBoxErrorMessage: function (msg) {
            bootbox.alert({
                message: msg,
                centerVertical: true,
                callback: function () {
                }
            })
        },
        BootBoxSuccessMessage: function (msg) {
            msg = "<button class='btn btn-lg btn-success'><i class='fa fa-check-circle'></i></button> " + msg
            bootbox.alert({
                message: msg,
                centerVertical: true,
                callback: function () {
                }
            })
        },
        DeleteSingleSecurity: function (security, index, SID) {
            var msg = "<b>Do you really want to delete " + security + " with SecurityID " + SID; +"</b>"
            bootbox.confirm({
                size: "small",
                centerVertical: true,
                message: msg,
                callback: result => {
                    if (result) {
                        console.log('DeleteSingleSecurity')
                        console.log(security)
                        console.log(index)
                        console.log(SID)
                        if (security == "Equity") {

                            axios.get('https://localhost:5001/SQLHandler/Equity/delete', {
                                params: {
                                    id: SID
                                }
                            }
                            ).then(res => {
                                window.response = res;
                                if (res.data.statusCode == 200) {
                                    console.log(this.data)
                                    this.data.splice(index, 1)
                                    this.BootBoxSuccessMessage("Delete Operation Successful")
                                    this.BootboxDestroy();
                                }
                                else {
                                    this.BootBoxErrorMessage("Something wrong happened while delete Operation")
                                    this.BootboxDestroy();

                                }

                            }).catch(err => {
                                this.BootBoxErrorMessage("Something wrong happened while delete Operation")
                                this.BootboxDestroy();
                            });
                        }
                        else {
                            axios.get('https://localhost:5001/SQLHandler/Bond/delete', {
                                params: {
                                    id: SID
                                }
                            }

                            ).then(res => {
                                if (res.data.statusCode == 200) {
                                    this.data.splice(index, 1)
                                    this.BootBoxSuccessMessage("Delete Operation Successful")
                                    this.BootboxDestroy();
                                }
                                else {
                                    this.BootBoxErrorMessage("Something wrong happened while delete Operation")
                                    this.BootboxDestroy();
                                }

                            }).catch(err => {
                                this.BootBoxErrorMessage("Something wrong happened while delete Operation")
                                this.BootboxDestroy();
                            });
                        }

                    }
                }
            })

        }
    }
})



var tile = new Vue({

    el: "#SecMasterApp",
    data: {
        currentTab: "Equity",
        loading_equity: "true",
        loading_bond: "true",
        equity_data: [],
        equity_header: [],
        bond_data: [],
        bond_header: [],

        info: [],
        selected_equity: [],
        selected_bond: [],
        SelectedSecurities: []
    },
    beforeMount: function () {
        //bring data from equity //and bonds.
        axios.get('https://localhost:5001/SQLHandler/Equity'
        ).then(res => {
            var response = res['data']['Table']
            response.forEach(element => {
                this.equity_data.push(element)
            });
            window.Equity = this.equity_data
            this.equity_header = Object.keys(this.equity_data[0])

        }).catch(err => {
            bootbox.alert({
                message: "Something wrong happened while loading data. Check if your Web API is running?",
                centerVertical: true,
                callback: function () {
                }
            })
            window.setTimeout(function () {
                bootbox.hideAll();
            }, 2000);
        });

        axios.get('https://localhost:5001/SQLHandler/Bond'
        ).then(res => {
            console.log(res.status)
            var response = res['data']['Table']
            response.forEach(element => {
                this.bond_data.push(element)
            });

            window.Bond = this.bond_data
            this.bond_header = Object.keys(this.bond_data[0])
        }).catch(err => {
            bootbox.alert({
                message: "Something wrong happened while loading data. Check if your Web API is running?",
                centerVertical: true,
                callback: function () {
                }
            })
        })

    },
    methods: {
        neeraj() {
            for (i = 0; i < 10; i++) {


            }
        }
    }

})