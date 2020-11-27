import React from 'react';
import { Tooltip, SvgIcon } from '@material-ui/core';
import { Room as Pin } from '@material-ui/icons';

export default function PinIcon(props: object) {
  return (
    <Tooltip title="Participant is pinned. Click to un-pin." placement="top">
      <SvgIcon style={{ float: 'right', fontSize: '29px' }}>
        <Pin {...props} />
      </SvgIcon>
    </Tooltip>
  );
}
