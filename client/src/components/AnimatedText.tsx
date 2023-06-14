import { motion } from 'framer-motion'

const AnimatedText = ({text, className}:{text:string, className:string}) => {
    const word = {
        hidden:{
            opacity:0
        },
        visible:{
            opacity:1,
            transition:{
                delay:0.5,
                staggerChildren: 0.1,
            }
        }
    }
    const SingleWord = {
        hidden:{
            opacity:0,
            y:50
        },
        visible:{
            opacity:1,
            y:0,
            transition:{
                duration:0.5,
            }
        }
    }

  return (
    <div className='w-full mx-auto py-2 flex items-center md:justify-center  text-center'>
        <motion.h1 
        variants={word}
        initial='hidden'
        animate='visible'
        className={`${className}`}>
            {
                text.split(" ").map((word, index) =>
                <motion.span 
                variants={SingleWord}
                key={word+ '_'+index} className='inline-block'>
                    {word}&nbsp;
                </motion.span>
                )
            }
        </motion.h1>
    </div>
  )
}

export default AnimatedText