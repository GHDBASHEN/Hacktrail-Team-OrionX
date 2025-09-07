// const validateEvent = (req, res, next) => {
//     const { eventType, eventDate, pax, contactPersonName, contactPersonNumber } = req.body;

//     // Check for missing fields
//     if (!eventType || !eventDate || !pax || !contactPersonName || !contactPersonNumber) {
//         return res.status(400).json({ error: 'All fields (eventType, eventDate, pax, contactPersonName, contactPersonNumber) are required.' });
//     }

//     // Ensure pax is a positive number
//     if (isNaN(pax) || pax <= 0) {
//         return res.status(400).json({ error: 'Pax must be a positive number.' });
//     }

//     // Validate event date format (YYYY-MM-DD)
//     const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//     if (!dateRegex.test(eventDate)) {
//         return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
//     }

//     // Validate contactPersonNumber (must be 10-digit numeric)
//     if (!/^\d{10}$/.test(contactPersonNumber)) {
//         return res.status(400).json({ error: 'Invalid contact number. It should be a 10-digit number.' });
//     }

//     // Trim whitespace from input fields
//     req.body.eventType = eventType.trim();
//     req.body.contactPersonName = contactPersonName.trim();
//     req.body.contactPersonNumber = contactPersonNumber.trim();

//     next();
// };

// export { validateEvent }; // Named export
