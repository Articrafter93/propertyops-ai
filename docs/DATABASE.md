# PropertyOps AI - Modelo de Datos (Diseño Conceptual)
_16 entidades · Modelo operativo completo para gestión de habitaciones en alquiler_

> **Estado.** Este es el **modelo de datos conceptual objetivo** (capa de datos = **Supabase /
> PostgreSQL**). La demo construida implementa un **subconjunto** de estas entidades como datos
> sembrados (`frontend/lib/types.ts` + `frontend/data/seed.json`). Los tipos listados abajo
> usan nomenclatura descriptiva (heredada del diseño original); en Supabase se mapean a columnas
> Postgres (`text`, `numeric`, `timestamptz`, `boolean`, relaciones por FK, etc.).

---

## 1. Properties (Propiedades)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `Property_ID` | Formula | PK autoincremental: PROP-XXX |
| `Name` | Single line text | Nombre del edificio o vivienda |
| `Address` | Single line text | Dirección completa |
| `City` | Single line text | Ciudad |
| `Total_Units` | Number | Número total de habitaciones/camas |
| `Status` | Single select | Active / Maintenance / Closed |
| `Manager_Email` | Email | Responsable operativo |
| `Created_At` | Date | Fecha de alta en sistema |

---

## 2. Rooms (Habitaciones)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `Room_ID` | Formula | PK: ROOM-XXX |
| `Property_ID` | Link → Properties | FK a propiedad |
| `Room_Number` | Single line text | Número de habitación (101, 202…) |
| `Type` | Single select | Individual / Doble / Suite |
| `Price` | Currency (EUR) | Renta mensual base |
| `Status` | Single select | Available / Occupied / Cleaning / Maintenance |
| `Floor` | Number | Planta del inmueble |
| `Area_m2` | Number | Superficie en m² |
| `Notes` | Long text | Observaciones internas |

---

## 3. Beds/Units (Camas/Unidades)
_Para propiedades HMO donde una habitación tiene múltiples camas comercializables_

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `Bed_ID` | Formula | PK: BED-XXX |
| `Room_ID` | Link → Rooms | FK a habitación |
| `Bed_Number` | Single line text | A, B, C… dentro de la habitación |
| `Status` | Single select | Available / Occupied / Maintenance |
| `Current_Tenant_ID` | Link → Tenants | Inquilino actual (si aplica) |
| `Price_Override` | Currency (EUR) | Precio propio (null = usa precio de Room) |

---

## 4. Tenants (Inquilinos)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `Tenant_ID` | Formula | PK: TENANT-XXX |
| `Full_Name` | Single line text | Nombre completo |
| `Email` | Email | Correo electrónico |
| `Phone` | Phone | Número WhatsApp con prefijo internacional |
| `ID_DNI` | Single line text | DNI/NIE/Pasaporte |
| `Nationality` | Single line text | Nacionalidad |
| `Room_ID` | Link → Rooms | Habitación actual |
| `Status` | Single select | Lead / Active / Checkout / Archive |
| `Move_In_Date` | Date | Fecha de entrada |
| `Drive_Folder_ID` | Single line text | ID de carpeta en Google Drive |

---

## 5. Leads / Candidatos
_Tabla independiente; se convierte en Tenant al aprobarse_

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `Lead_ID` | Formula | PK: LEAD-XXX |
| `Full_Name` | Single line text | Nombre del candidato |
| `Email` | Email | |
| `Phone` | Phone | |
| `Employment` | Single select | Employed / Self-Employed / Unemployed / Student |
| `Monthly_Income` | Currency | Ingresos mensuales declarados |
| `Room_Interest_ID` | Link → Rooms | Habitación de interés |
| `Score` | Number | 0-100 calculado por GAS lead_scoring |
| `Status` | Single select | New / In-Review / Auto-Approved / Manual-Review / Rejected / Contrato-Enviado |
| `References` | Number | Número de referencias aportadas |
| `Has_Guarantor` | Checkbox | Tiene avalista |
| `Raw_Data` | Long text | JSON del formulario original |
| `Reviewed_By` | Single line text | Email del revisor manual |
| `Created_At` | Date | Fecha de solicitud |

---

## 6. Contracts (Contratos)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `Contract_ID` | Formula | PK: CONT-XXX |
| `Tenant_ID` | Link → Tenants | FK |
| `Room_ID` | Link → Rooms | FK |
| `Start_Date` | Date | Fecha de inicio |
| `End_Date` | Date | Fecha de vencimiento |
| `Monthly_Rent` | Currency (EUR) | Renta mensual pactada |
| `Deposit` | Currency (EUR) | Depósito en garantía |
| `PDF_Link` | URL | Enlace al PDF firmado en Drive |
| `Signed_Date` | Date | Fecha de firma efectiva |
| `Status` | Single select | Draft / Signed / Expired / Terminated |

---

## 7. Documents (Documentos)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `Document_ID` | Formula | PK: DOC-XXX |
| `Tenant_ID` | Link → Tenants | FK |
| `Type` | Single select | Contract / ID / Reference / Payslip / Insurance / Invoice |
| `Drive_URL` | URL | Enlace en Google Drive |
| `Filename` | Single line text | Nombre del archivo |
| `Signed_Date` | Date | Fecha de firma (si aplica) |
| `Expiry_Date` | Date | Fecha de caducidad (para IDs, seguros) |
| `Status` | Single select | Valid / Expired / Pending |
| `Uploaded_At` | Date | Fecha de subida |

---

## 8. Incidents (Incidencias)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `Incident_ID` | Formula | PK: INC-XXX |
| `Room_ID` | Link → Rooms | FK |
| `Tenant_ID` | Link → Tenants | FK (puede ser nulo si reporta gestor) |
| `Description` | Long text | Descripción detallada |
| `Priority` | Single select | Low / Medium / High / Emergency |
| `Status` | Single select | Open / In Progress / Resolved / Closed |
| `Technician_ID` | Link → Technicians | Técnico asignado |
| `SLA_Hours` | Number | Horas SLA según prioridad |
| `Source` | Single select | WhatsApp / Form / QR / Admin |
| `Evidence` | Attachment | Fotos o vídeos adjuntos |
| `Created_At` | DateTime | |
| `Updated_At` | DateTime | |
| `Resolved_At` | DateTime | Fecha/hora de resolución |

---

## 9. Check-in / Checkout Records
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `Checkin_ID` | Formula | PK: CHKN-XXX |
| `Tenant_ID` | Link → Tenants | FK |
| `Room_ID` | Link → Rooms | FK |
| `Type` | Single select | Check-in / Checkout |
| `Date` | Date | Fecha efectiva |
| `Notice_Date` | Date | Fecha en que se dio el aviso (para salidas) |
| `Planned_Date` | Date | Fecha planificada de salida |
| `Inspection_ID` | Link → Visual_Inspections | Inspección asociada |
| `Charges_Total` | Currency (EUR) | Total cargos por daños |
| `Deposit_Returned` | Currency (EUR) | Depósito devuelto al inquilino |
| `Status` | Single select | Scheduled / In-Progress / Complete |
| `Notes` | Long text | Observaciones del gestor |

---

## 10. Inventory Master (Inventario maestro)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `Item_ID` | Formula | PK: ITEM-XXX |
| `Room_ID` | Link → Rooms | FK |
| `Item_Name` | Single line text | Nombre del objeto |
| `Category` | Single select | Furniture / Electronics / Fixtures / Linens / Appliances |
| `Quantity` | Number | Cantidad en inventario |
| `Condition` | Single select | Good / Worn / Damaged / Missing |
| `Last_Inspected` | Date | Última verificación visual |
| `Replacement_Cost` | Currency (EUR) | Coste de reposición estimado |

---

## 11. Visual Inspections (Inspecciones visuales)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `Inspection_ID` | Formula | PK: INSP-XXX |
| `Room_ID` | Link → Rooms | FK |
| `Tenant_ID` | Link → Tenants | FK |
| `Type` | Single select | Check-in / Check-out |
| `Date` | Date | Fecha de inspección |
| `AI_Score` | Percent | Puntuación de estado (0-100) |
| `Findings` | Long text | JSON con lista de hallazgos |
| `Billable_Items` | Long text | JSON con cargos aplicables |
| `Notes` | Long text | Resumen narrativo generado por IA |
| `Photo_File_ID` | Single line text | ID del archivo en Drive |

---

## 12. Payments / Charges (Pagos y cargos)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `Payment_ID` | Formula | PK: PAY-XXX |
| `Tenant_ID` | Link → Tenants | FK |
| `Amount` | Currency (EUR) | Importe |
| `Date` | Date | Fecha |
| `Type` | Single select | Rent / Deposit / Damage / Service / Refund |
| `Status` | Single select | Pending / Paid / Overdue / Cancelled |
| `Note` | Single line text | Referencia o descripción del cargo |

---

## 13. Technicians / Providers (Técnicos)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `Tech_ID` | Formula | PK: TEC-XXX |
| `Name` | Single line text | Nombre o razón social |
| `Specialty` | Single select | Plumbing / Electrical / General / Cleaning / HVAC / Locksmith |
| `Phone` | Phone | Número de contacto (WhatsApp) |
| `Email` | Email | |
| `Active` | Checkbox | Disponible para asignación |
| `Rating` | Number | Valoración media (1-5) |
| `Current_Incidents` | Count | Rollup de incidencias abiertas asignadas |
| `Notes` | Long text | Observaciones internas |

---

## 14. Messages / Comms Logs (Registro de comunicaciones)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `Message_ID` | Formula | PK: MSG-XXX |
| `Channel` | Single select | WhatsApp / Email / SMS / Voice |
| `Direction` | Single select | Inbound / Outbound |
| `Tenant_ID` | Link → Tenants | FK (si aplica) |
| `Tech_ID` | Link → Technicians | FK (si aplica) |
| `Body` | Long text | Texto del mensaje o transcripción |
| `Template_Used` | Single line text | Nombre de la plantilla WA utilizada |
| `Timestamp` | DateTime | Fecha y hora |
| `Status` | Single select | Sent / Delivered / Read / Failed |
| `Scenario_ID` | Single line text | ID del escenario Make que lo generó |
| `Correlation_Event` | Single line text | ID del evento que originó el mensaje |

---

## 15. Daily / Weekly KPIs
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `KPI_ID` | Formula | PK: KPI-XXX |
| `Date` | Date | Fecha del snapshot |
| `Occupancy_Rate` | Percent | Tasa de ocupación (%) |
| `Monthly_Revenue` | Currency (EUR) | Ingresos del mes en curso |
| `Open_Incidents` | Number | Incidencias abiertas |
| `Resolved_This_Month` | Number | Incidencias resueltas en el mes |
| `Avg_Lead_Score` | Number | Score medio de leads del mes |
| `Conversion_Rate` | Percent | Tasa de conversión lead→contrato |
| `Avg_Days_To_Close` | Number | Días medios desde lead hasta contrato |
| `SLA_Compliance_Rate` | Percent | % incidencias resueltas dentro del SLA |
| `Avg_Resolution_Hours` | Number | Horas medias de resolución |
| `Pending_Payments` | Number | Pagos pendientes o vencidos |
| `Outstanding_Balance` | Currency (EUR) | Saldo vencido total |
| `Active_Checkouts` | Number | Salidas activas en proceso |

---

## 16. Audit Log (Registro de auditoría)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `Log_ID` | Formula | PK: LOG-XXX |
| `Timestamp` | DateTime | Fecha y hora exacta |
| `Actor` | Single line text | Script o usuario que ejecutó la acción |
| `Action` | Single select | Create / Update / Delete / Sent / Error |
| `Entity` | Single line text | Tabla afectada |
| `Record_ID` | Single line text | ID del registro modificado |
| `Payload` | Long text | JSON resumido del cambio o evento |
| `Scenario_ID` | Single line text | ID del escenario Make (si aplica) |

---

## Relaciones clave

```
Properties ──< Rooms ──< Beds
               Rooms ──< Tenants
               Rooms ──< Incidents
               Rooms ──< Inventory_Master
               Rooms ──< Visual_Inspections
               Tenants ──< Contracts
               Tenants ──< Documents
               Tenants ──< Payments
               Tenants ──< Checkin_Checkout
               Tenants ──< Messages_Comms
               Technicians ──< Incidents
               Visual_Inspections ──< Checkin_Checkout
```
