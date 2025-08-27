import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';

// Simulación de base de datos (en producción usarías una base de datos real)
const readings = new Map();

interface Reading {
  id: string;
  timestamp: string;
  question: string;
  firstCard: string;
  secondCard: string;
  thirdCard: string;
  status: 'pending' | 'completed';
  interpretation?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generar un ID único para la lectura
    const readingId = crypto.randomBytes(16).toString('hex');
    
    const reading: Reading = {
      id: readingId,
      timestamp: new Date().toISOString(),
      question: body.question,
      firstCard: body.firstCard,
      secondCard: body.secondCard,
      thirdCard: body.thirdCard,
      status: 'pending'
    };

    // Guardar la lectura (en producción, esto iría a una base de datos)
    readings.set(readingId, reading);

    return NextResponse.json({
      readingId,
      status: 'pending',
      message: 'Las cartas están siendo interpretadas...'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error processing reading' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Esta ruta puede ser usada por aplicaciones externas para obtener las lecturas
  // o para actualizar las interpretaciones
  const { searchParams } = new URL(request.url);
  const readingId = searchParams.get('id');

  if (!readingId) {
    return NextResponse.json(
      { error: 'Reading ID is required' },
      { status: 400 }
    );
  }

  const reading = readings.get(readingId);

  if (!reading) {
    return NextResponse.json(
      { error: 'Reading not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(reading);
}

// Endpoint para que aplicaciones externas actualicen la interpretación
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { readingId, interpretation } = body;

    if (!readingId || !interpretation) {
      return NextResponse.json(
        { error: 'Reading ID and interpretation are required' },
        { status: 400 }
      );
    }

    const reading = readings.get(readingId);
    if (!reading) {
      return NextResponse.json(
        { error: 'Reading not found' },
        { status: 404 }
      );
    }

    // Actualizar la lectura
    reading.interpretation = interpretation;
    reading.status = 'completed';
    readings.set(readingId, reading);

    return NextResponse.json({ status: 'success', reading });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error updating reading' },
      { status: 500 }
    );
  }
}
