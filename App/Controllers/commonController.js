let commonController = {};

commonController.updateTable = function(updateObject, tableName, id, whereColumnName = 'id'){
    return new Promise( async function(resolve, reject) {
      try{
         let query = `UPDATE ${tableName} SET `;
         let valueArray = [];
         let columnValue = [];
         for (var key in updateObject) {
          if (updateObject.hasOwnProperty(key)) {
            columnValue.push('`'+key+'` = ? ');
            valueArray.push(updateObject[key]);
          }
         }
        query += columnValue.join(", ")+` where ${whereColumnName} = ? `;
        valueArray.push(id);
        let result = await queryExecutePromissified(query,valueArray); 
        resolve(result.changedRows || 0);
      }catch(e){
        reject(e);
      }
    });
}

commonController.insertInDB = function(data, tableName){
    return new Promise( async function(resolve, reject) {
        try{
         let query = `INSERT INTO ${tableName} `;
         let valueArray = [];
         let columnValue = [];
         let symboleValue = [];
         for (var key in data) {
          if (data.hasOwnProperty(key)) {
            columnValue.push(key);
            symboleValue.push('?');
            valueArray.push(data[key]);
          }
         }
        query += '(`'+columnValue.join("`, `")+'`) VALUES ('+symboleValue.join(", ")+')';
        let result = await queryExecutePromissified(query,valueArray); 
          resolve((result.insertId||0));
        }catch(e){
          reject(e);
        }
    });
}
  
commonController.findInDb = function(condition, tableName, fields, delimeter = ' OR ') {
    return new Promise(async function(resolve, reject) {
        try {
            if (!condition) {
               return reject('please provide condition');
            }
            let conditionArray = [];
            let valueArray = [];
            for (var key in condition) {
                if (condition.hasOwnProperty(key)) {
                    conditionArray.push(key + ' = ?');
                    valueArray.push(condition[key]);
                }
            }
            let query = `SELECT ${fields.join()} FROM ${tableName} where ` + (conditionArray).join(`${delimeter}`);
            let result = await queryExecutePromissified(query, valueArray);
            resolve(result);
        } catch (e) {
            return reject(e);
        }
    });
}

commonController.deleteInDb = function(tableName, whereColumnValue, whereColumnName = 'id'){
    return new Promise(async (resolve, reject) => {
      try{
        let query = `DELETE FROM ${tableName} `;
          query += `WHERE ${whereColumnName} = ? `;
          let result = await queryExecutePromissified(query, [whereColumnValue]);
          resolve(result['affectedRows'] || 0);
      } catch(err){
        reject(err);
      }
    });
}


commonController.validateReqBody = function(req, req_data, key) {
    key = key || 'body';
    if(!req_data.length) {
      return 0;
    }
    let blank_array = [];
    for(let count = 0; count < req_data.length; count++) {
      console.log("Key",key,"Req[key] --> ",req[key],!req[key])
      if( !req[key] ||
        req[key][req_data[count]] === 'undefined'   ||
        req[key][req_data[count]] === undefined   ||
        req[key][req_data[count]] === null   ||
        (typeof req[key][req_data[count]] == 'string' && req[key][req_data[count]].trim() == "") ||
        req[key][req_data[count]] === " " || 
        req[key][req_data[count]] === "") {
        blank_array.push(req_data[count]);
      }
    }
    console.log('array ' , blank_array);
    if(blank_array.length) {
      return blank_array.join(',');
    }
    return 0;
}
module.exports = commonController
