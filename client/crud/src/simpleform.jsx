
import React, { useState, useEffect } from 'react'; 
import { PlusCircle, Edit, Trash2, Search, X } from 'lucide-react'; 
import axios from 'axios'; 

const DailyHabitTracker = () => {

  const [habits, setHabits] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); // Search term 
  const [selectedCategory, setSelectedCategory] = useState(''); // Selected category filter.
  const [showModal, setShowModal] = useState(false); // Modal visibility flag.
  const [editingHabit, setEditingHabit] = useState(null); // Habit being edited.
  const [newHabit, setNewHabit] = useState({ name: '', category: '' }); // New habit data.

  // Array of predefined categories for habits.
  const categories = ['الصحة', 'التعلم', 'الصحة العقلية'];

  // Fetch habits when the component mounts.
  useEffect(() => {
    fetchHabits(); // get habbits
  }, []);

  // Fetch habits from the server.
  const fetchHabits = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks'); // GET request to the server.
      const validHabits = response.data.filter(habit => habit && habit.name); // Filter out invalid habits.
      setHabits(validHabits); // Set the valid habits to state.
    } catch (error) {
      console.error('Error fetching habits:', error); 
      setHabits([]); 
    }
  };

  // Filter habits based on search term and selected category.
  const filteredHabits = habits.filter(habit =>
    habit && habit.name &&
    habit.name.toLowerCase().includes(searchTerm.toLowerCase()) && // Filter by search term.
    (selectedCategory === '' || habit.category === selectedCategory) // Filter by category.
  );

  // Add or edit a habit in the server.
  const handleAddOrEditHabit = async () => {
    if (newHabit.name && newHabit.category) { // Check if new habit has both name and category.
      try {
        if (editingHabit) { // If editing, update existing habit.
          await axios.put(`http://localhost:5000/tasks/${editingHabit._id}`, newHabit);
        } else { // If adding, create a new habit.
          await axios.post('http://localhost:5000/tasks', { ...newHabit, completed: false });
        }
        fetchHabits(); // Refresh the habit list.
        setNewHabit({ name: '', category: '' }); // Reset the new habit form.
        setEditingHabit(null); // Clear the editing state.
        setShowModal(false); // Close the modal.
      } catch (error) {
        console.error('Error adding/editing habit:', error); // Log error if the request fails.
      }
    }
    
  };

  // Delete a habit from the server.
  const handleDeleteHabit = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`); // DELETE request to the server.
      fetchHabits(); // Refresh the habit list.
    } catch (error) {
      console.error('Error deleting habit:', error); // Log error if deleting fails.
    }
  };

  // Toggle the completion status of a habit.
  const handleToggleCompletion = async (id) => {
    try {
      const habit = habits.find(h => h._id === id); // Find the habit to toggle.
      await axios.put(`http://localhost:5000/tasks/${id}`, { completed: !habit.completed }); // Update the habit's completion status.
      fetchHabits(); // Refresh the habit list.
    } catch (error) {
      console.error('Error toggling habit completion:', error); // Log error if toggling fails.
    }
  };

  // Prepare a habit for editing.
  const handleEditHabit = (habit) => {
    setEditingHabit(habit); // Set the habit to edit.
    setNewHabit({ name: habit.name, category: habit.category }); // Populate form with existing habit data.
    setShowModal(true); // Open the modal.
  };

  return (
    <div className="container mx-auto p-4 font-sans" dir="rtl">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-4 text-center">متتبع العادات اليومية</h1>
      
      {/* Search bar, category filter, and add button */}
      <div className="mb-4 flex justify-between items-center">
        <div className="relative">
          {/* Search input */}
          <input
            type="text"
            placeholder="البحث عن عادة"
            className="p-2 border rounded-md pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term.
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" /> {/* Search icon */}
        </div>
        
        {/* Category dropdown */}
        <select
          className="p-2 border rounded-md"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)} // Update selected category.
        >
          <option value="">جميع الفئات</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option> // Category options.
          ))}
        </select>
        
        {/* Add new habit button */}
        <button
          className="bg-blue-500 text-white p-2 rounded-md flex items-center"
          onClick={() => {
            setEditingHabit(null); // Clear editing state.
            setNewHabit({ name: '', category: '' }); // Reset new habit form.
            setShowModal(true); // Show the modal.
          }}
        >
          <PlusCircle className="mr-2" /> {/* Add icon */}
          إضافة عادة جديدة
        </button>
      </div>
      
      {/* List of habits */}
      <ul className="space-y-2">
        {filteredHabits.map(habit => (
          <li key={habit._id} className="flex items-center justify-between bg-white p-3 rounded-md shadow">
            <div className="flex items-center">
              {/* Checkbox for habit completion */}
              <input
                type="checkbox"
                checked={habit.completed}
                onChange={() => handleToggleCompletion(habit._id)} // Toggle completion status.
                className="mr-3"
              />
              <span className={habit.completed ? 'line-through' : ''}>{habit.name}</span> {/* Display habit name */}
            </div>
            <div className="flex items-center">
              {/* Habit category badge */}
              <span className="bg-gray-200 text-sm rounded-full px-3 py-1 mr-2">{habit.category}</span>
              {/* Edit button */}
              <button className="text-blue-500 mr-2" onClick={() => handleEditHabit(habit)}><Edit size={20} /></button>
              {/* Delete button */}
              <button className="text-red-500" onClick={() => handleDeleteHabit(habit._id)}><Trash2 size={20} /></button>
            </div>
          </li>
        ))}
      </ul>
      
      {/* Modal for adding/editing habits */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md relative">
            {/* Modal title */}
            <h2 className="text-xl font-bold mb-4">{editingHabit ? 'تعديل العادة' : 'إضافة عادة جديدة'}</h2>
            {/* Close modal button */}
            <button 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              <X size={20} />
            </button>
            {/* Habit name input */}
            <input
              type="text"
              placeholder="اسم العادة"
              className="p-2 border rounded-md mb-2 w-full"
              value={newHabit.name}
              onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
            />
            {/* Habit category dropdown */}
            <select
              className="p-2 border rounded-md mb-4 w-full"
              value={newHabit.category}
              onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
            >
              <option value="">اختر الفئة</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {/* Modal action buttons */}
            <div className="flex justify-end">
              <button className="bg-gray-300 text-black p-2 rounded-md mr-2" onClick={() => setShowModal(false)}>إلغاء</button>
              <button className="bg-blue-500 text-white p-2 rounded-md" onClick={handleAddOrEditHabit}>
                {editingHabit ? 'حفظ التغييرات' : 'إضافة'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyHabitTracker; 









































// import React, { useState, useEffect } from 'react';
// import { PlusCircle, Edit, Trash2, Search, X } from 'lucide-react';
// import axios from 'axios';

// const DailyHabitTracker = () => {
//   const [habits, setHabits] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [editingHabit, setEditingHabit] = useState(null);
//   const [newHabit, setNewHabit] = useState({ name: '', category: '' });



//   const categories = ['الصحة', 'التعلم', 'الصحة العقلية'];

//   useEffect(() => {
//     fetchHabits();
//   }, []);

//   const fetchHabits = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/tasks');
//       const validHabits = response.data.filter(habit => habit && habit.name);
//       setHabits(validHabits);
//     } catch (error) {
//       console.error('Error fetching habits:', error);
//       setHabits([]);

//     }
//   };


//   const filteredHabits = habits.filter(habit => 
//     habit && habit.name && 
//     habit.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//     (selectedCategory === '' || habit.category === selectedCategory)
//   );

//   const handleAddOrEditHabit = async () => {
//     if (newHabit.name && newHabit.category) {
//       try {
//         if (editingHabit) {
//           await axios.put(`http://localhost:5000/tasks/${editingHabit._id}`, newHabit);
//         } else {
//           await axios.post('http://localhost:5000/tasks', { ...newHabit, completed: false });
//         }
//         fetchHabits();
//         setNewHabit({ name: '', category: '' });
//         setEditingHabit(null);
//         setShowModal(false);
//       } catch (error) {
//         console.error('Error adding/editing habit:', error);
//       }
//     }
//   };

//   const handleDeleteHabit = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/tasks/${id}`);
//       fetchHabits();
//     } catch (error) {
//       console.error('Error deleting habit:', error);
//     }
//   };

//   const handleToggleCompletion = async (id) => {
//     try {
//       const habit = habits.find(h => h._id === id);
//       await axios.put(`http://localhost:5000/tasks/${id}`, { completed: !habit.completed });
//       fetchHabits();
//     } catch (error) {
//       console.error('Error toggling habit completion:', error);
//     }
//   };

//   const handleEditHabit = (habit) => {
//     setEditingHabit(habit);
//     setNewHabit({ name: habit.name, category: habit.category });
//     setShowModal(true);
//   };

//   return (
//     <div className="container mx-auto p-4 font-sans" dir="rtl">
//       <h1 className="text-3xl font-bold mb-4 text-center">متتبع العادات اليومية</h1>
      
//       <div className="mb-4 flex justify-between items-center">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="البحث عن عادة"
//             className="p-2 border rounded-md pl-10"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//         </div>
        
//         <select
//           className="p-2 border rounded-md"
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//         >
//           <option value="">جميع الفئات</option>
//           {categories.map(category => (
//             <option key={category} value={category}>{category}</option>
//           ))}
//         </select>
        
//         <button
//           className="bg-blue-500 text-white p-2 rounded-md flex items-center"
//           onClick={() => {
//             setEditingHabit(null);
//             setNewHabit({ name: '', category: '' });
//             setShowModal(true);
//           }}
//         >
//           <PlusCircle className="mr-2" />
//           إضافة عادة جديدة
//         </button>
//       </div>
      
//       <ul className="space-y-2">
//         {filteredHabits.map(habit => (
//           <li key={habit._id} className="flex items-center justify-between bg-white p-3 rounded-md shadow">
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={habit.completed}
//                 onChange={() => handleToggleCompletion(habit._id)}
//                 className="mr-3"
//               />
//               <span className={habit.completed ? 'line-through' : ''}>{habit.name}</span>
//             </div>
//             <div className="flex items-center">
//               <span className="bg-gray-200 text-sm rounded-full px-3 py-1 mr-2">{habit.category}</span>
//               <button className="text-blue-500 mr-2" onClick={() => handleEditHabit(habit)}><Edit size={20} /></button>
//               <button className="text-red-500" onClick={() => handleDeleteHabit(habit._id)}><Trash2 size={20} /></button>
//             </div>
//           </li>
//         ))}
//       </ul>
      
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-4 rounded-md relative">
//             <h2 className="text-xl font-bold mb-4">{editingHabit ? 'تعديل العادة' : 'إضافة عادة جديدة'}</h2>
//             <button 
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//               onClick={() => setShowModal(false)}
//             >
//               <X size={20} />
//             </button>
//             <input
//               type="text"
//               placeholder="اسم العادة"
//               className="p-2 border rounded-md mb-2 w-full"
//               value={newHabit.name}
//               onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
//             />
//             <select
//               className="p-2 border rounded-md mb-4 w-full"
//               value={newHabit.category}
//               onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
//             >
//               <option value="">اختر الفئة</option>
//               {categories.map(category => (
//                 <option key={category} value={category}>{category}</option>
//               ))}
//             </select>
//             <div className="flex justify-end">
//               <button className="bg-gray-300 text-black p-2 rounded-md mr-2" onClick={() => setShowModal(false)}>إلغاء</button>
//               <button className="bg-blue-500 text-white p-2 rounded-md" onClick={handleAddOrEditHabit}>
//                 {editingHabit ? 'تحديث' : 'إضافة'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DailyHabitTracker;