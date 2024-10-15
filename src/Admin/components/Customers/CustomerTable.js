import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  IconButton,
  Snackbar,
  Alert,
  Button, 
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const CustomerTable = ({ members, onDelete }) => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);


  const handleShow = (id) => {
    navigate(`/customer-show/${id}`); 
  };

  const handleDelete = (id) => {
    setDeleteId(id); 
    setOpenSnackbar(true); 
  };

  // Confirm delete action
  const confirmDelete = async () => {
    await onDelete(deleteId); 
    setDeleteId(null);
    setOpenSnackbar(false);
  };

  // Handle editing customer data
  const handleEdit = (member) => {
   
    navigate(`/CustomerEdit/${member.id}`, { state: { member } });
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel>Username</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Email</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Phone</TableSortLabel>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.username}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleShow(member.id)}>
                    <VisibilityIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(member)}>
                    <EditIcon color="secondary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(member.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar for delete confirmation */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="warning"
          action={
            <>
              <Button color="inherit" onClick={confirmDelete}>
                Confirm
              </Button>
              <Button color="inherit" onClick={() => setOpenSnackbar(false)}>
                Cancel
              </Button>
            </>
          }
        >
          Are you sure you want to delete this member?
        </Alert>
      </Snackbar>
    </>
  );
};

export default CustomerTable;
