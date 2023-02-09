/* Change structure of data stockage
 *
 * @param data {json} - data in the json object
 * @returns an array
 */
function restructurationData(data){
    let arr = [];
    for (let i in data["x"]){
      arr.push([data["x"][i],data["y"][i]])
    }
    return (arr);
  }

