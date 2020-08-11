         
import pyodbc 
import math
from pandas import read_excel
# Some other example server values are
# server = 'localhost\sqlexpress' # for a named instance
# server = 'myserver,port' # to specify an alternate port
server = '192.168.0.104,59718' 
database = 'test_neeraj' 
username = 'sa' 
password = 'valley@1234' 
cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)
cursor = cnxn.cursor()
 
# find your sheet name at the bottom left of your excel file and assign 
# it to my_sheet 
my_sheet = 'Bonds' # change it to your sheet name
file_name = 'Data for securities.xlsx' # change it to the name of your excel file
df = read_excel(file_name, sheet_name = my_sheet)

num_of_cols = len(df.columns)

cursor.execute('exec sp_columns equity')
row = cursor.fetchone()
column_types =  []
while num_of_cols:
    #print(row)
    column_types.append(row[5])
    row = cursor.fetchone()
    num_of_cols = num_of_cols-1

column_types.pop(0)
 
cols = df.columns
cols =cols[1:]
for row in range(0,len(df)):
    sql = "Insert into equity values ("
    for c in range(len(cols)):
         col = cols[c] 
         print(df[str(col)][row])
         
     
    
 