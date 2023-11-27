import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import { useState } from 'react';
import styles from '@/styles/Home.module.css';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function LottoNumber({ szelveny, num, setSzelveny }) {
  console.log(szelveny)
  let checked = szelveny.sz.indexOf(String(num)) == -1 ? false : true;
  return (
    <FormControlLabel
      onChange={(e) => {
        setSzelveny({ sz: [...szelveny.sz, e.target.value], jatekos: true });
      }}
      value={num}
      disabled={szelveny.sz.length == 5}
      control={<Radio checked={checked} />}
      label={num}
    />
  );
}
