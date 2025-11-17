// Paquete: com.chicharronesweb.pedidosapi.dto
package com.chicharronesweb.pedidosapi.dto;

import lombok.Data;

@Data
public class DetallePedidoRequestDTO {
    private Integer productoId;
    private int cantidad;
	public Integer getProductoId() {
		return productoId;
	}
	public void setProductoId(Integer productoId) {
		this.productoId = productoId;
	}
	public int getCantidad() {
		return cantidad;
	}
	public void setCantidad(int cantidad) {
		this.cantidad = cantidad;
	}
    
}