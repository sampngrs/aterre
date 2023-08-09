import { motion } from "framer-motion";

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  
  export default function LoadingTextGradient({

    height = '16px', 
    width = '15px'})

    {

        const BackgroundVariants = {
            initial: {
                backgroundPosition:'0% 50%'
            },
            animate: {
                backgroundPosition:'100% 50%'
            }
          };

    return (
        <div style={{display:"flex", gap:"5px", flexWrap:"wrap"}}>
            {[4, 3, 2].map((e, i) => 
            
            <motion.div 
                variants={BackgroundVariants}
                initial="initial"
                animate="animate"
                transition={{
                    repeatType: 'reverse',
                    repeat: Infinity,
                    duration: 5
                }}
                className='test' style={{height: height, width: randomIntFromInterval(80, 20)}}>
                
        </motion.div>)}
        </div>
        
    );
}