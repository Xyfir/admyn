import AdminPanel from '../client';
import { render } from 'react-dom';
import React from 'react';

render(
  <AdminPanel title="admyn" api="/admyn/" />,
  document.getElementById('content')
);
