// async function getUsers(filters) {
//     let baseQuery = 'SELECT * FROM users';
//     let conditions = [];
//     let values = [];
  
//     // Add conditions based on filters
//     if (filters.age) {
//       conditions.push(`age >= $${conditions.length + 1}`);
//       values.push(filters.age);
//     }
  
//     if (filters.status) {
//       conditions.push(`status = $${conditions.length + 1}`);
//       values.push(filters.status);
//     }
  
//     // Add a WHERE clause if there are any conditions
//     if (conditions.length > 0) {
//       baseQuery += ' WHERE ' + conditions.join(' AND ');
//     }
  
//     // Add sorting
//     if (filters.sortBy) {
//       baseQuery += ` ORDER BY ${filters.sortBy}`;
//     }
  
//     // Add limit
//     if (filters.limit) {
//       baseQuery += ` LIMIT $${values.length + 1}`;
//       values.push(filters.limit);
//     }
  
//     // Execute the query with dynamic values
//     try {
//       const res = await pool.query(baseQuery, values);
//       console.log(res.rows);
//     } catch (err) {
//       console.error('Error executing query', err.stack);
//     }
//   }
  


// async function insertUser(userData) {
//     let baseQuery = 'INSERT INTO users (';
//     let columns = [];
//     let values = [];
//     let placeholders = [];
  
//     // Dynamically add columns and values
//     Object.keys(userData).forEach((key, index) => {
//       columns.push(key);
//       values.push(userData[key]);
//       placeholders.push(`$${index + 1}`);
//     });
  
//     baseQuery += columns.join(', ') + ') VALUES (' + placeholders.join(', ') + ') RETURNING *';
  
//     try {
//       const res = await pool.query(baseQuery, values);
//       console.log(res.rows[0]); // Returning the inserted user
//     } catch (err) {
//       console.error('Error executing insert', err.stack);
//     }
//   }


// async function updateUser(id, updates) {
//     let baseQuery = 'UPDATE users SET ';
//     let setStatements = [];
//     let values = [];
//     let index = 1;
  
//     // Dynamically add SET conditions
//     Object.keys(updates).forEach((key) => {
//       setStatements.push(`${key} = $${index}`);
//       values.push(updates[key]);
//       index++;
//     });
  
//     baseQuery += setStatements.join(', ') + ` WHERE id = $${index}`;
//     values.push(id); // Push the ID to the values array
  
//     try {
//       const res = await pool.query(baseQuery, values);
//       console.log('Update successful', res.rowCount);
//     } catch (err) {
//       console.error('Error executing update', err.stack);
//     }
//   }
  
  