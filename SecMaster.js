var Insert = Vue.component('Insert', {
    template:
        `
    <div>
    Neeraj
    </div>
    `
})

Vue.component('component-security', {
    data: function () {
        return {
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
    components: {
        'Insert': Insert
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
             <!-- <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong">
                Launch demo modal
            </button>-->
           
               
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
        <button type="button" data-toggle="modal"  class="btn btn-info" @click="Neeraj" style="margin-top:2%" data-target="#exampleModal">
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
                                      
                                </td>
                    <td v-for="(value, propertyName) in column"> {{ value }}</td>
                                     
                </tr>
            </tbody>
        </table>
        </div>
    
        </div>
        
    `,
    methods: {
        Neeraj: function () {
            bootbox.dialog({
                message: "I am a custom dialog",
                title: "Custom title",
                onEscape: function() {},
                show: true,
                backdrop: true,
                closeButton: true,
                animate: true,
                className: "my-modal",
                buttons: {
                  success: {   
                    label: "Success!",
                    className: "btn-success",
                    callback: function() {}
                  },
                  "Danger!": {
                    className: "btn-danger",
                    callback: function() {}
                  },
                  "Another label": function() {}
                }
              });
             
            
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