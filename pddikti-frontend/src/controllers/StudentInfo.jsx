import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const StudentInfo = () => {
  const [nim, setNim] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const studentsPerPage = 10;
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);

  const debouncedNim = useDebounce(nim, 500);

  const fetchStudents = async (searchNim, page) => {
    if (!searchNim.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    Swal.fire({
      title: '',
      text: 'Fetching student data...',
      icon: 'info',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await fetch(`https://pddikti-backend.vercel.app/search/${searchNim}?page=${page}&limit=${studentsPerPage}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();
      setStudents(data);
      setTotalResults(data.length);

      Swal.close();
    } catch (err) {
      setError(err.message);

      Swal.fire({
        title: '',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'Okay'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedNim) {
      setCurrentPage(1);
      fetchStudents(debouncedNim, 1);
    } else {
      setStudents([]);
    }
  }, [debouncedNim]);

  const fetchStudentDetails = async (studentId) => {
    setLoading(true);
    setError(null);

    Swal.fire({
      title: '',
      text: 'Getting student details...',
      icon: 'info',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await fetch(`https://pddikti-backend.vercel.app/detail/${studentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch student details');
      }
      const data = await response.json();
      setStudentDetails(data);

      Swal.close();
    } catch (err) {
      setError(err.message);

      Swal.fire({
        title: 'Error!',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'Okay'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsClick = (studentId) => {
    setSelectedStudent(studentId);
    fetchStudentDetails(studentId);
  };

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const closeModal = () => setStudentDetails(null);

  return (
    <div className="container mx-auto p-6">
      {/* Advantages Section */}
      <div className="mb-8 text-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center mr-3">
              <span className="font-bold">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Fast Response API</h3>
              <p className="text-gray-600">
                The API provides fast responses to ensure a smooth and efficient user experience.
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3">
              <span className="font-bold">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">No Google Verification Captcha</h3>
              <p className="text-gray-600">
                Enjoy a seamless experience without the need for Google Captcha verification.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Student NIM Search */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          className="p-2 w-1/2 border border-gray-300 rounded"
          placeholder="Enter NIM"
          value={nim}
          onChange={(e) => setNim(e.target.value)}
        />
      </div>

      {loading && <p className="text-center"></p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {students.length === 0 && !loading && !error && nim.trim() !== '' && (
        <p className="text-center">No students found for the given NIM.</p>
      )}

      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left border border-gray-300 bg-gray-100">Nama</th>
            <th className="px-4 py-2 text-left border border-gray-300 bg-gray-100">NIM</th>
            <th className="px-4 py-2 text-left border border-gray-300 bg-gray-100">Nama Universitas</th>
            <th className="px-4 py-2 text-left border border-gray-300 bg-gray-100">Program Studi</th>
            <th className="px-4 py-2 text-left border border-gray-300 bg-gray-100">Detail</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student) => (
            <tr key={student.nim}>
              <td className="px-4 py-2 border border-gray-300">{student.nama}</td>
              <td className="px-4 py-2 border border-gray-300">{student.nim}</td>
              <td className="px-4 py-2 border border-gray-300">{student.nama_pt} ({student.sinkatan_pt})</td>
              <td className="px-4 py-2 border border-gray-300">{student.nama_prodi}</td>
              <td className="px-4 py-2 border border-gray-300">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={() => handleDetailsClick(student.id)}
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 mx-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 mx-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage * studentsPerPage >= totalResults}
        >
          Next
        </button>
      </div>

      {studentDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-3/4 max-w-4xl">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left border border-gray-300 bg-gray-100">Field</th>
                  <th className="px-4 py-2 text-left border border-gray-300 bg-gray-100">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Nama</td>
                  <td className="px-4 py-2 border border-gray-300">{studentDetails.nama}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">NIM</td>
                  <td className="px-4 py-2 border border-gray-300">{studentDetails.nim}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Program Studi</td>
                  <td className="px-4 py-2 border border-gray-300">{studentDetails.prodi}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Nama Universitas</td>
                  <td className="px-4 py-2 border border-gray-300">{studentDetails.nama_pt}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Jenis Kelamin</td>
                  <td className="px-4 py-2 border border-gray-300">
                    {studentDetails.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Tanggal Masuk</td>
                  <td className="px-4 py-2 border border-gray-300">
                    {new Date(studentDetails.tanggal_masuk).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Status Awal Mahasiswa</td>
                  <td className="px-4 py-2 border border-gray-300">{studentDetails.jenis_daftar}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">Status Terbaru Mahasiswa</td>
                  <td className="px-4 py-2 border border-gray-300">{studentDetails.status_saat_ini}</td>
                </tr>
              </tbody>
            </table>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentInfo;