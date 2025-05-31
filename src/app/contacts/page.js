export default function contactsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">Contacts</h1>
          <div className="flex space-x-3 mb-6">
              <a
                  href="https://github.com/reddevil212"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 rounded-full transition-colors"
                  aria-label="GitHub Profile"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
              </a>
              <a
                  href="mailto:business.memchat@gmail.com"
                  className="p-2 bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Email"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                  </svg>
              </a>
              <a
                  href="https://api.whatsapp.com/send/?phone=917699958813&text=hi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Twitter Profile"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.601 2.326A7.947 7.947 0 0 0 8.034.002C3.594.002 0 3.586 0 8.012c0 1.41.369 2.767 1.068 3.966L0 16l4.107-1.077a8.009 8.009 0 0 0 3.92 1.01h.003c4.438 0 8.033-3.585 8.033-8.011 0-2.144-.83-4.162-2.462-5.596zM8.03 14.596h-.003a6.566 6.566 0 0 1-3.34-.918l-.239-.142-2.434.638.651-2.374-.155-.244a6.535 6.535 0 0 1-.995-3.474c0-3.623 2.95-6.57 6.578-6.57 1.756 0 3.405.683 4.645 1.922a6.524 6.524 0 0 1 1.933 4.643c-.002 3.623-2.95 6.569-6.641 6.569zm3.587-4.92c-.196-.098-1.152-.568-1.33-.632-.178-.066-.308-.098-.438.098s-.504.63-.618.76c-.114.13-.228.147-.424.049-.196-.098-.827-.305-1.574-.973-.582-.518-.975-1.157-1.089-1.353-.114-.196-.012-.302.086-.398.088-.087.196-.228.293-.342.098-.114.13-.196.196-.327.065-.13.032-.245-.016-.342-.049-.098-.438-1.057-.601-1.45-.158-.38-.319-.33-.438-.336l-.373-.007c-.13 0-.342.049-.52.245s-.683.668-.683 1.63.7 1.885.798 2.016c.098.13 1.38 2.102 3.346 2.947.468.202.832.322 1.116.412.469.149.895.128 1.233.078.376-.056 1.152-.47 1.316-.924.163-.455.163-.844.114-.924-.049-.08-.178-.13-.373-.228z" />
                  </svg>

              </a>
          </div>
    </div>
  );
}