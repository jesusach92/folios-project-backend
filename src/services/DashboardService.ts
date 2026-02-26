import { DashboardRepository } from "../repositories/DashboardRepository";
import logger from "../config/logger";

export class DashboardService {
  private dashboardRepository = new DashboardRepository();

  async getDashboardData(userId: number, role: string) {
    try {
      const dashboardData = await this.dashboardRepository.getDashboardDataByRole(userId, role);
      
      // Transform the data into the format the frontend expects
      const kpis = [
        {
          id: 'folio-total',
          label: 'Total de Folios',
          valor: dashboardData.stats.totalFolios || 0,
          unidad: 'folios',
          Icon: '📋',
          color: 'blue',
          cambio: 0,
          tendencia: 'up' as const,
        },
        {
          id: 'en-proceso',
          label: 'En Proceso',
          valor: dashboardData.stats.activeFolios || 0,
          unidad: 'folios',
          Icon: '⏳',
          color: 'yellow',
          cambio: 0,
          tendencia: 'up' as const,
        },
        {
          id: 'completados',
          label: 'Completados Hoy',
          valor: dashboardData.completedToday || 0,
          unidad: 'folios',
          Icon: '✅',
          color: 'green',
          cambio: 0,
          tendencia: 'up' as const,
        },
        {
          id: 'retrasados',
          label: 'Retrasados',
          valor: dashboardData.delayedFolios.length || 0,
          unidad: 'folios',
          Icon: '⚠️',
          color: 'red',
          cambio: 0,
          tendencia: 'up' as const,
        },
      ];

      // Transform active folios to the frontend format
      const foliosActivos = dashboardData.activeFolios.map((folio: any) => ({
        id: `folio-${folio.id}`,
        numero: folio.numero,
        titulo: `${folio.proyecto} - ${folio.numero}`,
        estado: folio.estado.toLowerCase(),
        progreso: folio.progreso || 0,
        fechaVencimiento: new Date(folio.ultimaActualizacion).toLocaleDateString('es-ES'),
        responsable: 'Usuario',
        prioridad: folio.progreso > 70 ? 'baja' : folio.progreso > 40 ? 'media' : 'alta',
        documentos: folio.totalComponentes || 0,
        ultimaActualizacion: this.formatTimeAgo(new Date(folio.ultimaActualizacion)),
      }));

      // Transform delayed folios
      const foliosRetrasados = dashboardData.delayedFolios?.map((folio: any) => ({
        id: `folio-${folio.id}`,
        numero: folio.numero,
        titulo: `${folio.proyecto} - ${folio.numero}`,
        estado: folio.estado.toLowerCase(),
        progreso: 0,
        fechaVencimiento: new Date(folio.fechaCreacion).toLocaleDateString('es-ES'),
        responsable: 'Usuario',
        prioridad: 'crítica' as const,
        documentos: 0,
        ultimaActualizacion: this.formatTimeAgo(new Date(folio.fechaCreacion)),
      }));

    //   // Transform activities to alerts
    //   const alertasRecientes = dashboardData.recentActivities.map((activity: any) => ({
    //     id: `alert-${activity.id}`,
    //     titulo: 'Notificación del Sistema',
    //     mensaje: activity.mensaje || activity.description,
    //     tipo: this.getAlertType(activity.tipo),
    //     timestamp: this.formatTimeAgo(new Date(activity.timestamp)),
    //     leida: false,
    //     accion: { label: 'Ver detalle', href: '/detail' },
    //   }));

      logger.info('Dashboard data retrieved', { userId, role });

      return {
        kpis,
        foliosActivos,
        foliosRetrasados,
        // alertasRecientes,
        lastUpdate: new Date().toLocaleTimeString('es-ES'),
      };
    } catch (error: any) {
      logger.error('Error retrieving dashboard data', { userId, role, error: error.message });
      throw error;
    }
  }

  async getDashboardStatsOverview() {
    try {
      return await this.dashboardRepository.getDashboardStats();
    } catch (error: any) {
      logger.error('Error retrieving dashboard stats', { error: error.message });
      throw error;
    }
  }

  async getFolioDistribution() {
    try {
      return await this.dashboardRepository.getFolioDistribution();
    } catch (error: any) {
      logger.error('Error retrieving folio distribution', { error: error.message });
      throw error;
    }
  }

  async getProjectsOverview() {
    try {
      return await this.dashboardRepository.getProjectsOverview();
    } catch (error: any) {
      logger.error('Error retrieving projects overview', { error: error.message });
      throw error;
    }
  }

  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `Hace ${days}d`;
    if (hours > 0) return `Hace ${hours}h`;
    if (minutes > 0) return `Hace ${minutes}m`;
    return 'Ahora';
  }

  private getAlertType(action: string): 'info' | 'warning' | 'error' | 'critical' {
    const type = action?.toLowerCase() || 'info';
    if (type.includes('delete') || type.includes('error')) return 'error';
    if (type.includes('warning') || type.includes('change')) return 'warning';
    if (type.includes('critical')) return 'critical';
    return 'info';
  }
}
