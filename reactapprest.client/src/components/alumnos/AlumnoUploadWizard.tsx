import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { AlumnoCreate } from '../../types/alumnoTypes';

interface Props {
    onClose?: () => void;
    apiBase?: string;
}

type ParsedRow = Record<string, unknown>;

const DEFAULT_BASE = 'https://localhost:7231/api/CaAlumnos';

export const AlumnoUploadWizard: React.FC<Props> = ({ onClose, apiBase = DEFAULT_BASE }) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const [rows, setRows] = useState<ParsedRow[]>([]);
    const [sending, setSending] = useState(false);
    const [progress, setProgress] = useState<{ sent: number; total: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // Added step 4 for success screen
    const [uploadedCount, setUploadedCount] = useState<number>(0);
    const [effectiveApiBase, setEffectiveApiBase] = useState<string>(apiBase);

    // Detect popup mode (mounted in a popup window) by query param or presence of opener
    const isPopupMode = (() => {
        try {
            const params = new URLSearchParams(window.location.search);
            return params.get('popup') === '1' || !!window.opener;
        } catch {
            return !!window.opener;
        }
    })();

    useEffect(() => {
        // If running as standalone/popup, listen for init messages from opener
        const onMessage = (ev: MessageEvent) => {
            if (ev.origin !== window.location.origin) return;
            const data = ev.data;
            if (!data || typeof data !== 'object') return;
            if ((data as { type?: string }).type === 'init' && (data as { apiBase?: string }).apiBase) {
                setEffectiveApiBase((data as { apiBase: string }).apiBase);
            }
        };
        window.addEventListener('message', onMessage);

        // tell the opener we're ready (it may post init data)
        try {
            window.opener?.postMessage({ type: 'ready' }, window.location.origin);
        } catch {
            // ignore
        }

        // on unmount notify opener if popup
        return () => {
            try {
                if (isPopupMode && !window.closed) {
                    window.opener?.postMessage({ type: 'upload:closed' }, window.location.origin);
                }
            } catch {
                // ignore
            }
            window.removeEventListener('message', onMessage);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const resolveBase = (base: string) => {
        // If full URL, return as-is.
        try {
            const u = new URL(base);
            return u.toString().replace(/\/+$/, '');
        } catch {
            // relative path: build absolute using current origin but force port 7231
            const origin = window.location.origin;
            try {
                const originUrl = new URL(origin);
                originUrl.port = '7231';
                const joined = new URL(base.replace(/^\/+/, ''), originUrl).toString();
                return joined.replace(/\/+$/, '');
            } catch {
                return DEFAULT_BASE;
            }
        }
    };

    const handleFile = async (file: File | null) => {
        setError(null);
        setRows([]);
        setFileName(file?.name ?? null);
        if (!file) return;

        setStep(2); // go to loading step

        try {
            const ext = file.name.split('.').pop()?.toLowerCase();
            if (ext === 'csv') {
                Papa.parse<ParsedRow>(file, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        setRows(results.data as ParsedRow[]);
                        setStep(3); // preview step
                    },
                    error: (err) => {
                        setError(`CSV parse error: ${err.message}`);
                        setStep(1);
                    },
                });
            } else if (ext === 'xlsx' || ext === 'xls') {
                const arrayBuffer = await file.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(sheet, { defval: '' }) as ParsedRow[];
                setRows(json);
                setStep(3); // preview step
            } else {
                setError('Unsupported file type. Use .csv, .xlsx or .xls');
                setStep(1);
            }
        } catch (ex: unknown) {
            setError((ex as Error)?.message ?? String(ex));
            setStep(1);
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        handleFile(f);
    };

    const cellToString = (v: unknown) => {
        if (v === null || v === undefined) return '';
        if (typeof v === 'string') return v;
        if (typeof v === 'number' || typeof v === 'boolean') return String(v);
        try {
            return JSON.stringify(v);
        } catch {
            return String(v);
        }
    };

    const normalizeRow = (row: ParsedRow): AlumnoCreate => {
        const getValue = (candidates: string[]) => {
            const lcCandidates = candidates.map((s) => s.toLowerCase());
            for (const k of Object.keys(row)) {
                if (lcCandidates.includes(k.toLowerCase())) return row[k];
            }
            return undefined;
        };

        const nombre = cellToString(getValue(['nombre', 'caAlumTNombre', 'nombre_alumno']) ?? '');
        const apellidoP = cellToString(getValue(['apellido', 'apellido_paterno', 'caAlumTApellidoPaterno']) ?? '');
        const apellidoM = cellToString(getValue(['apellido_materno', 'caAlumTApellidoMaterno']) ?? '');
        const telefono = cellToString(getValue(['telefono', 'telefono_alumno', 'caAlumTTelefono']) ?? '');
        const gradVal = getValue(['grado', 'gradonid', 'caGradNId', 'grado_id']);
        let caGradNId = 0;
        if (typeof gradVal === 'number') caGradNId = Math.trunc(gradVal);
        else if (typeof gradVal === 'string') caGradNId = parseInt(gradVal || '0', 10) || 0;

        const activoVal = getValue(['activo', 'bActivo', 'activo_flag']);
        let bActivo: boolean | null = null;
        if (typeof activoVal === 'boolean') bActivo = activoVal;
        else if (typeof activoVal === 'number') bActivo = activoVal !== 0;
        else if (typeof activoVal === 'string') {
            const v = activoVal.toLowerCase();
            if (v === 'true' || v === '1' || v === 'yes' || v === 'si') bActivo = true;
            else if (v === 'false' || v === '0' || v === 'no') bActivo = false;
        }

        return {
            caAlumTNombre: nombre,
            caAlumTApellidoPaterno: apellidoP,
            caAlumTApellidoMaterno: apellidoM,
            caAlumTTelefono: telefono,
            caGradNId: caGradNId,
            bActivo: bActivo,
        };
    };

    const notifyOpenerFinished = (count: number) => {
        try {
            if (isPopupMode && window.opener) {
                window.opener.postMessage({ type: 'upload:finished', data: { count } }, window.location.origin);
            }
        } catch {
            // ignore
        }
    };

    const uploadBulk = async () => {
        setError(null);
        if (!rows || rows.length === 0) {
            setError('No data to upload.');
            return;
        }

        setSending(true);
        setProgress({ sent: 0, total: rows.length });

        try {
            const mapped = rows.map(normalizeRow);
            const base = resolveBase(effectiveApiBase);
            const bulkUrl = `${base}/bulk`;

            // Try bulk first
            const resp = await fetch(bulkUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mapped),
            });

            if (resp.ok) {
                setSending(false);
                setUploadedCount(rows.length);
                notifyOpenerFinished(rows.length);
                setStep(4); // Go to success screen
                return;
            }

            // If bulk not available, fallback to per-item
            if (resp.status === 404 || !resp.ok) {
                for (let i = 0; i < mapped.length; i++) {
                    const url = base;
                    const r = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(mapped[i]),
                    });

                    if (!r.ok) {
                        const text = await r.text();
                        throw new Error(`Failed at row ${i + 1}: ${r.status} ${text}`);
                    }
                    setProgress({ sent: i + 1, total: mapped.length });
                }
                setSending(false);
                setUploadedCount(rows.length);
                notifyOpenerFinished(rows.length);
                setStep(4); // Go to success screen
            }
        } catch (ex: unknown) {
            // eslint-disable-next-line no-console
            console.error("Upload failed:", ex);
            setError("Error al subir uno o más registros del archivo seleccionado");
            setSending(false);
        }
    };

    const closeWizard = () => {
        if (onClose) {
            onClose();
        }

        if (isPopupMode) {
            try {
                window.close();
            } catch {
                // ignore
            }
        } else {
            // Reset to initial state if inline
            setStep(1);
            setRows([]);
            setFileName(null);
            setError(null);
        }
    };

    return (
        <div className="border rounded p-3 mb-3 shadow-sm">
            <h6 className="mb-2">Subir archivo (CSV / XLSX)</h6>

            {step === 1 && (
                <>
                    <div className="mb-2">
                        <input type="file" accept=".csv, .xlsx, .xls" onChange={onFileChange} />
                        {fileName && <div className="small text-muted mt-1">Archivo: {fileName}</div>}
                    </div>

                    {error && <div className="alert alert-danger py-1">{error}</div>}

                    <div className="d-flex align-items-center gap-2">
                        <button className="btn btn-secondary btn-sm" onClick={closeWizard}>
                            Cerrar
                        </button>
                    </div>
                </>
            )}

            {step === 2 && (
                <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
                    <div className="mt-2">Leyendo archivo...</div>
                </div>
            )}

            {step === 3 && (
                <>
                    {error && <div className="alert alert-danger py-1">{error}</div>}

                    <div className="mb-2">
                        <strong>Vista previa ({rows.length} filas)</strong>
                    </div>

                    <div className="table-responsive mb-2" style={{ maxHeight: 280, overflow: 'auto' }}>
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    {Object.keys(rows[0] || {}).map((k) => (
                                        <th key={k}>{k}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.slice(0, 10).map((r, idx) => (
                                    <tr key={idx}>
                                        {Object.keys(rows[0]).map((k) => (
                                            <td key={k + idx}>{cellToString(r[k])}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <button className="btn btn-success btn-sm" onClick={uploadBulk} disabled={sending}>
                            {sending ? 'Subiendo...' : 'Subir'}
                        </button>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={closeWizard}
                            disabled={sending}
                        >
                            Cerrar
                        </button>

                        {progress && (
                            <div className="ms-3 small">
                                {progress.sent} / {progress.total}
                            </div>
                        )}
                    </div>
                </>
            )}

            {step === 4 && (
                <div className="text-center py-4">
                    <div className="mb-3" style={{ fontSize: '2rem' }}>
                        &#x2705; {/* Checkmark symbol */}
                    </div>
                    <h5>Carga Exitosa</h5>
                    <p className="mb-4">{uploadedCount} registros fueron subidos correctamente.</p>
                    <button className="btn btn-primary" onClick={closeWizard}>
                        Cerrar
                    </button>
                </div>
            )}
        </div>
    );
};