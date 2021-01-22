import React, { useState, useEffect } from 'react';
import { Collections, LocalModel, Call, CallData } from '~/firebase/schema-types';

export default function SummaryContainer({
  call,
  data,
}: {
  call: LocalModel<Call>;
  data: { [key: string]: CallData };
}) {
  return <></>;
}
