export const pageContainerStyles = {
  background: 'linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)',
  borderRadius: 3,
  boxShadow: '0 10px 30px rgba(2, 6, 23, 0.06)',
  p: 3,
  overflow: 'visible',
};

export const pageHeaderStyles = {
  mb: 3,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 2,
};

export const formStyles = {
  '& .MuiTextField-root, & .MuiFormControl-root': {
    mb: 2,
    '& .MuiInputBase-root': {
      borderRadius: 2,
      backgroundColor: '#fff',
      boxShadow: '0 1px 0 rgba(2,6,23,0.04) inset',
      transition: 'box-shadow .2s ease, transform .2s ease',
      '&:hover': {
        boxShadow: '0 0 0 2px rgba(26,35,126,0.08) inset'
      },
      '&.Mui-focused': {
        boxShadow: '0 0 0 3px rgba(26,35,126,0.12) inset'
      },
    }
  },
};

export const tableContainerStyles = {
  height: 'calc(100vh - 220px)',
  width: '100%',
  '& .MuiDataGrid-root': {
    border: 'none',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'visible',
    '& .MuiDataGrid-cell:focus': {
      outline: 'none',
    },
    '& .MuiDataGrid-columnHeaders': {
      background: 'linear-gradient(90deg, #f8fafc 0%, #f2f4f7 100%)',
      borderBottom: '1px solid #eef2f7',
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: '#fafcff',
    },
    '& .MuiDataGrid-virtualScroller': {
      overflow: 'visible',
    },
    '& .MuiDataGrid-footerContainer': {
      position: 'sticky',
      bottom: 0,
      backgroundColor: '#fff',
      borderTop: '1px solid #eef2f7',
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      zIndex: 2,
      padding: '8px 12px',
    },
  },
};

export const buttonGroupStyles = {
  display: 'flex',
  gap: 2,
  justifyContent: 'flex-end',
  mt: 3,
};

export const primaryButtonStyles = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: 3,
  py: 1.5,
  px: 3,
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
  },
  '&:active': {
    transform: 'translateY(0px)',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.35)',
  },
  '&:disabled': {
    background: 'rgba(102, 126, 234, 0.5)',
    transform: 'none',
    boxShadow: 'none',
  },
};

export const secondaryButtonStyles = {
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(102, 126, 234, 0.2)',
  borderRadius: 3,
  py: 1.5,
  px: 3,
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  color: '#667eea',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(102, 126, 234, 0.05)',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
  },
  '&:active': {
    transform: 'translateY(0px)',
  },
};

export const dangerButtonStyles = {
  background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
  borderRadius: 3,
  py: 1.5,
  px: 3,
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 8px 25px rgba(245, 87, 108, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  '&:hover': {
    background: 'linear-gradient(135deg, #e73c4e 0%, #e080fb 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(245, 87, 108, 0.4)',
  },
  '&:active': {
    transform: 'translateY(0px)',
    boxShadow: '0 6px 20px rgba(245, 87, 108, 0.35)',
  },
  '&:disabled': {
    background: 'rgba(245, 87, 108, 0.5)',
    transform: 'none',
    boxShadow: 'none',
  },
};

export const cardStyles = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  p: 3,
  borderRadius: 3,
  boxShadow: '0 12px 30px rgba(2, 6, 23, 0.06)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 16px 40px rgba(2, 6, 23, 0.1)',
  },
};