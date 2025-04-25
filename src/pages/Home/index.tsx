import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { SFP } from '../../components/SFP';

// import logo from '../../assets/logo.png';

import styles from './styles.module.scss';

export function Home() {
  const [priceQuotationToCompare, setPriceQuotationToCompare] = useState([
    1
  ]);

  function handleAddPriceQuotation() {
    const tempArray = [...priceQuotationToCompare];

    setPriceQuotationToCompare([
      ...tempArray, 
      1
    ]);
  }

  async function handleRemovePriceQuotation(index: number) {    
    const tempPriceQuotationToCompare = priceQuotationToCompare;

    console.log(tempPriceQuotationToCompare);
    
    // if(tempPriceQuotationToCompare.length > 1) {
    //   tempPriceQuotationToCompare.splice(index, 1);
    // }   

    // setPriceQuotationToCompare(tempPriceQuotationToCompare);
  }

  return(
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.addButton} onClick={handleAddPriceQuotation}>
          <FiPlus size={20} />
          <p>add price quotation to compare</p>
        </button>
      </div>
      <div className={styles.content}>
        {
          priceQuotationToCompare.map((value, index) => <SFP closeSFP={handleRemovePriceQuotation} index={index} key={index} />)
        }        
      </div>
      {/* <div className={styles.footer}>
        <img src={logo} alt="GBMX" />
        <p>SFP GreenbrierMaxion | Desenvolvido pela área de <span>Tecnologia da Informação</span></p>
      </div> */}
    </div>
  );
}