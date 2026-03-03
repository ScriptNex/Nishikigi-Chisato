export default {

 command:"menu",

 async execute(ctx){

  await ctx.list({

   title:"🌸 Nishikigi Chisato",
   description:"Selecciona una opción disponible",
   footer:"Whispa JS v1.2.2",
   buttonText:"Abrir menú",

   sections:[

    {
     title:"⚙️ Comandos",
     rows:[
      {
       title:"Ping",
       description:"Probar si el bot está activo",
       id:".ping"
      },
      {
       title:"Info",
       description:"Ver información del bot",
       id:".info"
      }
     ]
    },

    {
     title:"📦 Sistema",
     rows:[
      {
       title:"Estado",
       description:"Ver estado actual",
       id:".status"
      }
     ]
    }

   ]

  })

 }

}
