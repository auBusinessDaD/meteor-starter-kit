import PropTypes from 'prop-types';
import React, { useState } from 'react';
// @mui
import { TableRow, TableCell, MenuItem, Checkbox, Typography } from '@mui/material';

// components
import { TableMoreMenu } from '../../../components/table';
import Iconify from '../../../components/Iconify';
import ConfirmDialog from '../../../components/ConfirmDialog';

// ----------------------------------------------------------------------

RatingTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func
};

export default function RatingTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { Rating, Description, Colour } = row;

  const [openMenu, setOpenMenuActions] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = () => {
    setDialogOpen(true);
  };

  const handleAgree = (isAgree) => {
    setDialogOpen(false);
    if (isAgree) onDeleteRow();
  };

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <ConfirmDialog
          onAgree={handleAgree}
          isOpen={dialogOpen}
          title="Meteor Starter Kit | Confirm"
          content="Are you sure to delete this item?"
        />
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap>
          {Rating}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle3" noWrap>
          {Description}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle3" noWrap>
          {Colour}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  handleDelete();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Delete
              </MenuItem>

              <MenuItem
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
