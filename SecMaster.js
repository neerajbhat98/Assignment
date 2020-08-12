var update = Vue.component('update',{
    template :
    `
    <div>
      neeraj bhat
     </div>
  
    `
})

Vue.component('component-security', {
    data: function () {
        return {
            gus : [],
            filterlist: this.securityData,
            parent_id_SearchFieldsEquity: [],
            parent_id_SearchFieldsBond: [],
            data: this.securityData,
            Selected: [],
            SearchFieldsEquity: ['SecurityName', 'CUSIP', 'ISIN', 'SEDOL', 'BBG_GLOBAL_ID', 'BLOOMBERG_UNIQUE_ID'],
            SearchFieldsBond: ['Asset Type', 'ISIN', 'BBG Unique ID', 'CUSIP', 'SEDOL'],
        }
    },

    props: ['header', 'securityData', 'tab'],
    components : {
        'update':update
    },
    computed: {
        filterlist() {

        }
    },

    watch: {
        parent_id_SearchFieldsEquity: function () {
            console.log("Equity")
            console.log(this.parent_id_SearchFieldsEquity.length)
            window.Equity = this.parent_id_SearchFieldsEquity

            this.data = this.filterlist.filter(element => {
                if (this.parent_id_SearchFieldsEquity[2]) {
                    console.log(element.Security_Name.includes(this.parent_id_SearchFieldsEquity[2]))
                    return element.ISIN.includes(this.parent_id_SearchFieldsEquity[2])
                }
                else
                    return true;

            })
        },
        parent_id_SearchFieldsBond: function () {
            console.log("Bond")
        }

    },

    template: `
    <div >
        <div>
            
                
              <form v-show="tab=='Equity'" class="form-inline" style =" margin-left: 10%;">
                
                    <span v-for ="(value,index) in SearchFieldsEquity" style="margin-left   :2%"> 
                        <input type="text" class="form-control" v-model ="parent_id_SearchFieldsEquity[index]" v-bind:placeholder="value"/>
                    </span>   
                    <button type="button" class="btn btn-info" v-on:click="ResetInput()" style="margin-left   :2%">Reset</button>  
              </form>
           
              <form v-show="tab=='Bond'" class="form-inline" style ="margin-bottom : 0% ;margin-left: 20%;">
                
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
        
        <table class="table table-striped table-dark" >
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
        
        InsertSecurity : function(){
            var p="<form id='infos' action=''>";
            for(item in this.header)
            {
                var j="inp"+item;				
                p=p+"<div>"+this.header[item]+"<input type='text'  id="+j+"/></br>"
            }
            p=p+"</form";
            bootbox.alert(p)
           
        },
       
        UpdateFormEquity:function(index,SID){
            var Security_Name = this.data[index].Security_Name
            console.log(index)
            console.log(this.data)
            var msg = "<form id='update'>\
            Security_Name  <input type='text'  class='bootboxInput'/><br/>\
            Security_Description <input type='text'  class='bootboxInput'/><br/>\
            Shares_Per_ADR	<input type='number'  class='bootboxInput'/><br/>\
            Total_Shares_Outstanding<input type ='number' step='0.01'  class='bootboxInput'/>\
            </form>" 
            var SName,shares,total_shares,SDes;
            var title = "Update Security "+this.tab+"with Security ID : "+SID
            bootbox.confirm({
                message: msg,
                title : title,
                centerVertical:true,
                callback: result => {
                   if(result)
                   {
                    window.form = document.getElementById('update')
                    var form = window.form
                    SName = form[0].value
                    if(SName=="")
                    SName = this.data[index].Security_Name
                    shares =form[2].value
                    if(shares=="")
                    shares = this.data[index].Shares_Per_ADR

                    total_shares = form[3].value
                    if(total_shares=="")
                    total_shares = this.data[index].Total_Shares_Outstanding
                    SDes = form[1].value
                    if(SDes=="")
                    SDes = this.data[index].Security_Description
                    axios.get('https://localhost:5001/SQLHandler/Equity/Update',
                    {
                        params :{
                            SID : SID,
                            SDes:SDes,
                            SName : SName,
                            shares: shares,
                            total_shares : total_shares
                        }
                    
                    }).then(response => {
                         
                       this.data[index].Security_Name =  SName
                       this.data[index].Security_Description =  SDes
                       this.data[index].Shares_Per_ADR =shares 
                       this.data[index].Total_Shares_Outstanding  = total_shares

                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                     


                   }
                  
             
                }
            });
        

        },
        UpdateFormBond : function(index, SID)
        {  var Security_Name = this.data[index].Security_Name
            console.log(index)
            console.log(this.data)
            var msg = "<form id='update'>\
            Security_Name  <input type='text'  class='bootboxInput'/ ><br/>\
            Security_Description <input type='text' class='bootboxInput'/><br/>\
            Coupon Frequency	<input type='number'  class='bootboxInput'/><br/>\
            Call Notification Max Days<input type ='number' step='0.01'  class='bootboxInput'/>\
            </form>" 
            var SName,COUPON_FREQUENCY,CALL_NOTIFICATION_MAX_DAYS,SDes;
            var title = "Update Security "+this.tab+" with Security ID : "+SID
            bootbox.confirm({
                message: msg,
                title : title,
                centerVertical:true,
                callback: result => {
                   if(result)
                   {
                    window.form = document.getElementById('update')
                    var form = window.form
                    SName = form[0].value
                    if(SName=="")
                    SName = this.data[index].Security_Name

                    SDes = form[1].value
                    if(SDes=="")
                    SDes = this.data[index].Security_Description

                    COUPON_FREQUENCY = form[2].value
                    if(COUPON_FREQUENCY=="")
                    COUPON_FREQUENCY = this.data[index].COUPON_FREQUENCY

                    CALL_NOTIFICATION_MAX_DAYS = form[3].value
                    if(CALL_NOTIFICATION_MAX_DAYS=="")
                    CALL_NOTIFICATION_MAX_DAYS = this.data[index].CALL_NOTIFICATION_MAX_DAYS
                    
                    axios.get('https://localhost:5001/SQLHandler/Bond/Update',
                    {
                        params :{
                            SID : SID,
                            SDes:SDes,
                            SName : SName,
                            freq: COUPON_FREQUENCY,
                            notification : CALL_NOTIFICATION_MAX_DAYS
                        }
                    
                    }).then(response => {
                         
                       this.data[index].Security_Name = SName 
                       this.data[index].Security_Description = SDes
                       this.data[index].COUPON_FREQUENCY =  COUPON_FREQUENCY
                       this.data[index].CALL_NOTIFICATION_MAX_DAYS  = CALL_NOTIFICATION_MAX_DAYS

                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                     


                   }
                  
             
                }
            });
        
        },
        UpdateSecurity:function(index,SID){
             if(this.tab=="Equity")
             this.UpdateFormEquity(index,SID);     
             else
             this.UpdateFormBond(index,SID);    
            
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

                                    if (xhttp.status == 200) {

                                        //this.data.splice(i,1);
                                        index.push(i);
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



                        }
                        this.Selected = []
                    }
                })
            }
        },
        ResetInput: function () {
            console.log(this.form)
            if (this.tab === "Equity")
                this.parent_id_SearchFieldsEquity = []
            else
                this.parent_id_SearchFieldsBond = []
        },
        DeleteSingleSecurity: function (security, index, SID) {
            var msg = "<b>Do you really want to delete " + security + " with SecurityID " + SID; +"</b>"
            bootbox.confirm({
                size: "small",
                centerVertical : true,
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
                                if (res.status == 200) {
                                    console.log(this.data)
                                    this.data.splice(index, 1)
                                }

                            }).catch(err => {
                                console.log(err);
                            });
                        }
                        else {
                            axios.get('https://localhost:5001/SQLHandler/Bond/delete', {
                                params: {
                                    id: SID
                                }
                            }

                            ).then(res => {
                                if (res.status == 200) {
                                    this.data.splice(index, 1)
                                }

                            }).catch(err => {
                                console.log(err);
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
            console.log(err);
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
            console.log(err)
        })

    },
    methods: {
        neeraj() {
            for (i = 0; i < 10; i++) {


            }
        }
    }

})